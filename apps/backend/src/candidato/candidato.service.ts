import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { EtapaTipo } from '@prisma/client';

const ETAPA_LABELS: Record<EtapaTipo, string> = {
  INSCRICAO: 'Cadastro e Inscrição',
  HABILITACAO_DOCUMENTAL: 'Habilitação Documental',
  AVALIACAO_COGNITIVA: 'Avaliação Objetiva',
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

  async updateDocs(candidatoId: string, files: Record<string, any[]>) {
    const DOC_FIELDS = [
      'docRg', 'docCpf', 'docResidencia', 'docTituloEleitor',
      'docQuitacao', 'docReservista', 'docDiploma', 'docPosGraduacao', 'docLotacao',
    ];
    const data: Record<string, string> = {};
    for (const field of DOC_FIELDS) {
      const file = files[field]?.[0];
      if (file) data[field] = file.filename;
    }
    if (Object.keys(data).length === 0) throw new BadRequestException('Nenhum arquivo enviado.');
    return this.prisma.candidato.update({
      where: { id: candidatoId },
      data,
      select: {
        docRg: true, docCpf: true, docResidencia: true, docTituloEleitor: true,
        docQuitacao: true, docReservista: true, docDiploma: true, docPosGraduacao: true, docLotacao: true,
      },
    });
  }

  async updateMe(candidatoId: string, body: Record<string, string>) {
    const allowed = [
      'nome','rg','orgaoEmissor','telefone','email',
      'cep','logradouro','numero','bairro','cidade',
      'vinculo','cargo','escola','matricula','municipio',
      'tempoServico','formacao','especializacao',
    ];
    const data: Record<string, string> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) data[key] = body[key];
    }
    return this.prisma.candidato.update({ where: { id: candidatoId }, data });
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
        ordem: index + 1,
        tipo,
        label: ETAPA_LABELS[tipo],
        status: etapaDb?.status ?? 'PENDENTE',
        pontuacao: etapaDb?.pontuacao ?? null,
        observacao: etapaDb?.observacao ?? null,
        recurso: etapaDb?.recurso ?? null,
        docChecks: etapaDb?.docChecks ?? null,
      };
    });

    const DOC_FIELDS_LIST = [
      'docRg', 'docCpf', 'docResidencia', 'docTituloEleitor',
      'docQuitacao', 'docReservista', 'docDiploma', 'docPosGraduacao', 'docLotacao',
    ] as const;

    const docsComProblema: string[] = [];
    for (const field of DOC_FIELDS_LIST) {
      const filename = (candidato as Record<string, any>)[field];
      if (filename && !existsSync(join(process.cwd(), 'uploads', filename))) {
        docsComProblema.push(field);
      }
    }

    return {
      candidato: {
        id: candidato.id,
        nome: candidato.nome,
        cpf: candidato.cpf,
        rg: candidato.rg,
        orgaoEmissor: candidato.orgaoEmissor,
        dataNasc: candidato.dataNasc,
        sexo: candidato.sexo,
        estadoCivil: candidato.estadoCivil,
        email: candidato.email,
        telefone: candidato.telefone,
        cep: candidato.cep,
        logradouro: candidato.logradouro,
        numero: candidato.numero,
        bairro: candidato.bairro,
        cidade: candidato.cidade,
        vinculo: candidato.vinculo,
        cargo: candidato.cargo,
        escola: candidato.escola,
        matricula: candidato.matricula,
        municipio: candidato.municipio,
        tempoServico: candidato.tempoServico,
        formacao: candidato.formacao,
        especializacao: candidato.especializacao,
        docRg:            candidato.docRg,
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
      docsComProblema,
    };
  }
}
