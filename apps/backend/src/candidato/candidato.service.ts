import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EtapaTipo } from '@prisma/client';

const ETAPA_LABELS: Record<EtapaTipo, string> = {
  INSCRICAO: 'Cadastro e Inscrição',
  HABILITACAO_DOCUMENTAL: 'Habilitação Documental',
  AVALIACAO_COGNITIVA: 'Avaliação Cognitiva',
  QUALIFICACAO_CURRICULAR: 'Qualificação Curricular',
  PLANO_GESTAO: 'Plano de Gestão',
  RESULTADO_FINAL: 'Resultado Final',
  CERTIFICACAO: 'Certificação',
};

const ETAPA_ORDER: EtapaTipo[] = [
  'INSCRICAO',
  'HABILITACAO_DOCUMENTAL',
  'AVALIACAO_COGNITIVA',
  'QUALIFICACAO_CURRICULAR',
  'PLANO_GESTAO',
  'RESULTADO_FINAL',
  'CERTIFICACAO',
];

@Injectable()
export class CandidatoService {
  constructor(private prisma: PrismaService) {}

  async submeterRecurso(etapaId: string, candidatoId: string, recurso: string) {
    const etapa = await this.prisma.etapaStatus.findFirst({
      where: { id: etapaId, inscricao: { candidatoId } },
    });
    if (!etapa) throw new NotFoundException('Etapa não encontrada.');
    if (etapa.status !== 'REPROVADO') throw new BadRequestException('Recurso só pode ser enviado em etapa reprovada.');
    if (etapa.recurso) throw new BadRequestException('Recurso já foi enviado para esta etapa.');

    return this.prisma.etapaStatus.update({
      where: { id: etapaId },
      data: { recurso, status: 'EM_ANALISE' },
    });
  }

  async getMe(candidatoId: string) {
    const candidato = await this.prisma.candidato.findUnique({
      where: { id: candidatoId },
      include: {
        inscricoes: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { etapas: true },
        },
      },
    });

    if (!candidato) throw new NotFoundException('Candidato não encontrado.');

    const inscricao = candidato.inscricoes[0] ?? null;

    const etapas = ETAPA_ORDER.map((tipo, index) => {
      const etapaDb = inscricao?.etapas.find(e => e.etapa === tipo);
      return {
        id: etapaDb?.id ?? null,
        ordem: index + 2,
        tipo,
        label: ETAPA_LABELS[tipo],
        status: etapaDb?.status ?? 'PENDENTE',
        pontuacao: etapaDb?.pontuacao ?? null,
        observacao: etapaDb?.observacao ?? null,
        recurso: etapaDb?.recurso ?? null,
        docChecks: etapaDb?.docChecks ?? null,
      };
    });

    return {
      candidato: {
        id: candidato.id,
        nome: candidato.nome,
        cpf: candidato.cpf,
        rg: candidato.rg,
        dataNasc: candidato.dataNasc,
        email: candidato.email,
        telefone: candidato.telefone,
        cargo: candidato.cargo,
        escola: candidato.escola,
        matricula: candidato.matricula,
        municipio: candidato.municipio,
        docRgCnh:         candidato.docRgCnh,
        docCpf:           candidato.docCpf,
        docResidencia:    candidato.docResidencia,
        docTituloEleitor: candidato.docTituloEleitor,
        docQuitacao:      candidato.docQuitacao,
        docReservista:    candidato.docReservista,
        docDiploma:       candidato.docDiploma,
        docPosGraduacao:  candidato.docPosGraduacao,
        docLotacao:       candidato.docLotacao,
      },
      inscricao: inscricao
        ? {
            id: inscricao.id,
            protocolo: inscricao.protocolo,
            createdAt: inscricao.createdAt,
          }
        : null,
      etapas,
    };
  }
}
