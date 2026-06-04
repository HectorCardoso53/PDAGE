import { Injectable, NotFoundException, ConflictException, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
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

const MEMBROS_COMISSAO = [
  { nome: 'Rogenáurea Farias do Rego',       cpf: '51219050253', email: 'naurea.rego36@gmail.com' },
  { nome: 'Felipe de Almeida Alvarenga',      cpf: '02346398225', email: 'feliperosbel11@gmail.com' },
  { nome: 'Evandro Soares Leite',             cpf: '41494873249', email: 'evanleite@gmail.com' },
  { nome: 'Maria Laise Picanço Siqueira',     cpf: '31108555268', email: 'lala-siqueira@hotmail.com' },
  { nome: 'Jorge Hipólito de Souza',          cpf: '65121171234', email: 'jorgehipolitodesouza@gmail.com' },
  { nome: 'Kátia Cristina do Rosário Lopes',  cpf: '00936298260', email: 'katia.cristina000@gmail.com' },
];

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    try {
      const count = await this.prisma.membroComissao.count();
      if (count === 0) {
        const senhaHash = await bcrypt.hash('Meritus@2026!', 10);
        for (const m of MEMBROS_COMISSAO) {
          await this.prisma.membroComissao.upsert({
            where: { cpf: m.cpf },
            update: {},
            create: { ...m, senhaHash, ativo: true },
          });
        }
      }
    } catch {
      // Tabela ainda não existe (antes do db push) — ignora silenciosamente
    }
  }

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
        docRg:            c.docRg,
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

  async updateEtapa(
    etapaId: string,
    dto: UpdateEtapaDto,
    user: { sub: string; role: string; nome: string },
  ) {
    const etapa = await this.prisma.etapaStatus.findUnique({
      where: { id: etapaId },
      include: { inscricao: { include: { candidato: true } } },
    });
    if (!etapa) throw new NotFoundException('Etapa não encontrada.');

    const dadosAntes = {
      status: etapa.status,
      pontuacao: etapa.pontuacao,
      observacao: etapa.observacao,
    };

    const atualizado = await this.prisma.etapaStatus.update({
      where: { id: etapaId },
      data: {
        status: dto.status,
        pontuacao: dto.pontuacao ?? null,
        observacao: dto.observacao ?? null,
        docChecks: dto.docChecks ?? null,
      },
    });

    const acaoVerbo =
      dto.status === 'APROVADO'   ? 'Habilitou' :
      dto.status === 'REPROVADO'  ? 'Inabilitou' :
      dto.status === 'EM_ANALISE' ? 'Colocou em análise' : 'Atualizou';

    await this.prisma.auditLog.create({
      data: {
        membroId: user.role === 'comissao' ? user.sub : null,
        autorNome: user.nome ?? 'Administrador Geral',
        autorRole: user.role,
        acao: `${acaoVerbo} — ${ETAPA_LABELS[etapa.etapa] ?? etapa.etapa}`,
        etapaTipo: etapa.etapa,
        candidatoNome: etapa.inscricao?.candidato?.nome ?? null,
        dadosAntes: JSON.stringify(dadosAntes),
        dadosDepois: JSON.stringify({
          status: atualizado.status,
          pontuacao: atualizado.pontuacao,
          observacao: atualizado.observacao,
        }),
      },
    });

    return atualizado;
  }

  async getAuditLogs() {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
      include: { membro: { select: { nome: true, email: true } } },
    });
  }

  async listMembros() {
    return this.prisma.membroComissao.findMany({
      orderBy: { nome: 'asc' },
      select: { id: true, nome: true, cpf: true, email: true, ativo: true, permissao: true, createdAt: true },
    });
  }

  async createMembro(dto: { nome: string; cpf: string; email: string; senha: string; permissao?: string }) {
    const cpf = dto.cpf.replace(/\D/g, '');
    const existing = await this.prisma.membroComissao.findFirst({ where: { OR: [{ cpf }, { email: dto.email }] } });
    if (existing) throw new ConflictException('CPF ou e-mail já cadastrado.');
    const senhaHash = await bcrypt.hash(dto.senha, 10);
    const permissao = dto.permissao === 'MASTER' ? 'MASTER' : 'AVALIADOR';
    return this.prisma.membroComissao.create({
      data: { nome: dto.nome, cpf, email: dto.email, senhaHash, ativo: true, permissao },
      select: { id: true, nome: true, cpf: true, email: true, ativo: true, permissao: true, createdAt: true },
    });
  }

  async updatePermissao(id: string, permissao: string) {
    const m = await this.prisma.membroComissao.findUnique({ where: { id } });
    if (!m) throw new NotFoundException('Membro não encontrado.');
    const val = permissao === 'MASTER' ? 'MASTER' : 'AVALIADOR';
    return this.prisma.membroComissao.update({
      where: { id },
      data: { permissao: val },
      select: { id: true, nome: true, cpf: true, email: true, ativo: true, permissao: true },
    });
  }

  async toggleMembro(id: string) {
    const m = await this.prisma.membroComissao.findUnique({ where: { id } });
    if (!m) throw new NotFoundException('Membro não encontrado.');
    return this.prisma.membroComissao.update({
      where: { id },
      data: { ativo: !m.ativo },
      select: { id: true, nome: true, cpf: true, email: true, ativo: true },
    });
  }

  async deleteMembro(id: string) {
    const m = await this.prisma.membroComissao.findUnique({ where: { id } });
    if (!m) throw new NotFoundException('Membro não encontrado.');
    await this.prisma.membroComissao.delete({ where: { id } });
    return { ok: true };
  }

  async resetSenhaMembro(id: string, novaSenha: string) {
    const m = await this.prisma.membroComissao.findUnique({ where: { id } });
    if (!m) throw new NotFoundException('Membro não encontrado.');
    const senhaHash = await bcrypt.hash(novaSenha, 10);
    await this.prisma.membroComissao.update({ where: { id }, data: { senhaHash } });
    return { ok: true };
  }
}
