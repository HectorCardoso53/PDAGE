import { Injectable, NotFoundException, ConflictException, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { existsSync } from 'fs';
import { join } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
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

type ReviewLock = { nome: string; sub: string; lockedAt: Date };
const LOCK_TTL_MS = 10 * 60 * 1000; // 10 min

@Injectable()
export class AdminService implements OnModuleInit {
  private reviewLocks = new Map<string, ReviewLock>();

  constructor(private prisma: PrismaService, private mail: MailService) {}

  private isLockExpired(lock: ReviewLock): boolean {
    return Date.now() - lock.lockedAt.getTime() > LOCK_TTL_MS;
  }

  acquireLock(candidatoId: string, user: { sub: string; nome: string }): { ok: boolean; lockedBy?: string } {
    const existing = this.reviewLocks.get(candidatoId);
    if (existing && !this.isLockExpired(existing) && existing.sub !== user.sub) {
      return { ok: false, lockedBy: existing.nome };
    }
    this.reviewLocks.set(candidatoId, { nome: user.nome, sub: user.sub, lockedAt: new Date() });
    return { ok: true };
  }

  releaseLock(candidatoId: string, userSub: string) {
    const existing = this.reviewLocks.get(candidatoId);
    if (existing?.sub === userSub) this.reviewLocks.delete(candidatoId);
    return { ok: true };
  }

  refreshLock(candidatoId: string, userSub: string) {
    const existing = this.reviewLocks.get(candidatoId);
    if (existing?.sub === userSub) existing.lockedAt = new Date();
    return { ok: true };
  }

  getLocks(): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [id, lock] of this.reviewLocks) {
      if (this.isLockExpired(lock)) { this.reviewLocks.delete(id); continue; }
      result[id] = lock.nome;
    }
    return result;
  }

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
        updatedAt: c.updatedAt,
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

  async notificarCandidato(candidatoId: string, assunto: string, mensagem: string) {
    const c = await this.prisma.candidato.findUnique({
      where: { id: candidatoId },
      select: { nome: true, email: true },
    });
    if (!c) throw new NotFoundException('Candidato não encontrado.');
    await this.mail.enviarMensagemPersonalizada({ nome: c.nome, email: c.email, assunto, mensagem });
    return { ok: true };
  }

  async notificarSemDocumentos() {
    const DOC_FIELDS = [
      'docRg', 'docCpf', 'docResidencia', 'docTituloEleitor',
      'docQuitacao', 'docReservista', 'docDiploma', 'docPosGraduacao', 'docLotacao',
    ] as const;

    const DOC_LABELS: Record<string, string> = {
      docRg:            'RG ou CNH',
      docCpf:           'CPF',
      docResidencia:    'Comprovante de Residência',
      docTituloEleitor: 'Título de Eleitor',
      docQuitacao:      'Quitação Eleitoral',
      docReservista:    'Carteira de Reservista',
      docDiploma:       'Diploma',
      docPosGraduacao:  'Certificado de Pós-graduação',
      docLotacao:       'Comprovante de Lotação',
    };

    const candidatos = await this.prisma.candidato.findMany({
      where: { inscricoes: { some: {} } },
      select: {
        nome: true, email: true,
        docRg: true, docCpf: true, docResidencia: true, docTituloEleitor: true,
        docQuitacao: true, docReservista: true, docDiploma: true,
        docPosGraduacao: true, docLotacao: true,
      },
    });

    let notificados = 0;
    for (const c of candidatos) {
      const docsFaltando = DOC_FIELDS.filter(f => {
        const val = c[f];
        if (!val) return true;
        return !existsSync(join(process.cwd(), 'uploads', val));
      });
      if (docsFaltando.length === 0) continue;
      const docsLabel = docsFaltando.map(f => DOC_LABELS[f] ?? f);
      await this.mail.enviarNotificacaoDocumentos({ nome: c.nome, email: c.email, docsLabel });
      notificados++;
    }
    return { notificados };
  }
}
