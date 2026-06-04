import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateEtapaDto } from './dto/update-etapa.dto';

const ETAPA_ORDER = [
  'INSCRICAO',
  'HABILITACAO_DOCUMENTAL',
  'AVALIACAO_COGNITIVA',
  'QUALIFICACAO_CURRICULAR',
  'PLANO_GESTAO',
  'RESULTADO_FINAL',
  'CERTIFICACAO',
] as const;

const ETAPA_LABELS: Record<string, string> = {
  INSCRICAO: 'Cadastro e Inscrição',
  HABILITACAO_DOCUMENTAL: 'Habilitação Documental',
  AVALIACAO_COGNITIVA: 'Avaliação Objetiva',
  QUALIFICACAO_CURRICULAR: 'Qualificação Curricular',
  PLANO_GESTAO: 'Plano de Gestão',
  RESULTADO_FINAL: 'Resultado Final',
  CERTIFICACAO: 'Certificação',
};

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async listCandidatos() {
    const candidatos = await this.prisma.candidato.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        inscricoes: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { etapas: true },
        },
      },
    });

    return candidatos.map((c) => {
      const inscricao = c.inscricoes[0] ?? null;
      const etapas = ETAPA_ORDER.map((tipo) => {
        const db = inscricao?.etapas.find((e) => e.etapa === tipo);
        return {
          id: db?.id ?? null,
          etapa: tipo,
          label: ETAPA_LABELS[tipo],
          status: db?.status ?? 'PENDENTE',
          pontuacao: db?.pontuacao ?? null,
          observacao: db?.observacao ?? null,
          recurso: db?.recurso ?? null,
          docChecks: db?.docChecks ?? null,
        };
      });

      return {
        id: c.id,
        nome: c.nome,
        cpf: c.cpf,
        dataNasc: c.dataNasc,
        rg: c.rg,
        orgaoEmissor: c.orgaoEmissor,
        sexo: c.sexo,
        estadoCivil: c.estadoCivil,
        email: c.email,
        telefone: c.telefone,
        cep: c.cep,
        logradouro: c.logradouro,
        numero: c.numero,
        bairro: c.bairro,
        cidade: c.cidade,
        vinculo: c.vinculo,
        cargo: c.cargo,
        escola: c.escola,
        matricula: c.matricula,
        municipio: c.municipio,
        tempoServico: c.tempoServico,
        formacao: c.formacao,
        especializacao: c.especializacao,
        createdAt: c.createdAt,
        docRgFrente:      c.docRgFrente,
        docRgVerso:       c.docRgVerso,
        docCpf:           c.docCpf,
        docResidencia:    c.docResidencia,
        docTituloEleitor: c.docTituloEleitor,
        docQuitacao:      c.docQuitacao,
        docReservista:    c.docReservista,
        docDiploma:       c.docDiploma,
        docPosGraduacao:  c.docPosGraduacao,
        docLotacao:       c.docLotacao,
        inscricao: inscricao
          ? { id: inscricao.id, protocolo: inscricao.protocolo, createdAt: inscricao.createdAt }
          : null,
        etapas,
      };
    });
  }

  async deleteCandidato(candidatoId: string) {
    const candidato = await this.prisma.candidato.findUnique({
      where: { id: candidatoId },
      include: { inscricoes: { include: { etapas: true } } },
    });
    if (!candidato) throw new NotFoundException('Candidato não encontrado.');

    for (const inscricao of candidato.inscricoes) {
      await this.prisma.etapaStatus.deleteMany({ where: { inscricaoId: inscricao.id } });
      await this.prisma.inscricao.delete({ where: { id: inscricao.id } });
    }
    await this.prisma.candidato.delete({ where: { id: candidatoId } });

    return { ok: true };
  }

  async updateEtapa(etapaId: string, dto: UpdateEtapaDto) {
    const etapa = await this.prisma.etapaStatus.findUnique({ where: { id: etapaId } });
    if (!etapa) throw new NotFoundException('Etapa não encontrada.');

    return this.prisma.etapaStatus.update({
      where: { id: etapaId },
      data: {
        status: dto.status,
        pontuacao: dto.pontuacao ?? null,
        observacao: dto.observacao ?? null,
        docChecks: dto.docChecks ?? null,
      },
    });
  }
}
