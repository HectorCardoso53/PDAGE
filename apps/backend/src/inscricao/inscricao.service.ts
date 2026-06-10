import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CriarInscricaoDto } from './dto/criar-inscricao.dto';
import { EtapaTipo } from '@prisma/client';

const ETAPAS: EtapaTipo[] = [
  'INSCRICAO',
  'HABILITACAO_DOCUMENTAL',
  'AVALIACAO_COGNITIVA',
  'QUALIFICACAO_CURRICULAR',
  'PLANO_GESTAO',
  'RESULTADO_FINAL',
  'CERTIFICACAO',
];

function pickFilename(files: Record<string, any[]>, field: string): string | undefined {
  return files[field]?.[0]?.filename;
}

@Injectable()
export class InscricaoService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
  ) {}

  private async gerarProtocolo(offset = 0): Promise<string> {
    const count = await this.prisma.inscricao.count();
    const seq = String(count + 1 + offset).padStart(4, '0');
    const ano = new Date().getFullYear();
    return `${seq}-PMO/SEMED-${ano}`;
  }

  async checkCpf(cpf: string): Promise<{ exists: boolean }> {
    const clean = cpf.replace(/\D/g, '');
    if (clean.length !== 11) return { exists: false };
    const found = await this.prisma.candidato.findUnique({ where: { cpf: clean }, select: { cpf: true } });
    return { exists: !!found };
  }

  async criar(dto: CriarInscricaoDto, files: Record<string, any[]>) {
    // 09/06/2026 23:59:59 BRT = 10/06/2026 02:59:59 UTC
    const PRAZO = new Date('2026-06-10T02:59:59Z');
    if (new Date() > PRAZO) {
      throw new BadRequestException('O prazo de inscrições encerrou em 09 de junho de 2026 às 23h59. Não é mais possível realizar novas inscrições.');
    }

    const cpf = dto.cpf.replace(/\D/g, '');

    const existente = await this.prisma.candidato.findUnique({ where: { cpf } });

    if (existente) {
      throw new ConflictException(
        `O CPF ${dto.cpf} já possui uma inscrição registrada no sistema. Acesse a Área do Candidato para acompanhar sua inscrição.`,
      );
    }

    const senhaHash = await bcrypt.hash(dto.senha, 10);

    const candidatoData = {
      cpf,
      senha: senhaHash,
      dataNasc:      new Date(dto.dataNasc),
      nome:          dto.nome,
      email:         dto.email,
      telefone:      dto.telefone.replace(/\D/g, ''),
      sexo:          dto.sexo,
      estadoCivil:   dto.estadoCivil,
      rg:            dto.rg,
      orgaoEmissor:  dto.orgaoEmissor,
      cep:           dto.cep?.replace(/\D/g, ''),
      logradouro:    dto.logradouro,
      numero:        dto.numero,
      bairro:        dto.bairro,
      cidade:        dto.cidade,
      vinculo:       dto.vinculo,
      cargo:         dto.cargo,
      escola:        dto.escola,
      matricula:     dto.matricula,
      municipio:     dto.municipio ?? 'Oriximiná',
      tempoServico:  dto.tempoServico,
      formacao:      dto.formacao,
      especializacao: dto.especializacao,
      docRg:            pickFilename(files, 'docRg'),
      docCpf:           pickFilename(files, 'docCpf'),
      docResidencia:    pickFilename(files, 'docResidencia'),
      docTituloEleitor: pickFilename(files, 'docTituloEleitor'),
      docQuitacao:      pickFilename(files, 'docQuitacao'),
      docReservista:    pickFilename(files, 'docReservista'),
      docDiploma:       pickFilename(files, 'docDiploma'),
      docPosGraduacao:  pickFilename(files, 'docPosGraduacao'),
      docLotacao:       pickFilename(files, 'docLotacao'),
    };

    // Tenta até 10 vezes caso haja conflito de protocolo (submissões simultâneas)
    for (let attempt = 0; attempt < 10; attempt++) {
      const protocolo = await this.gerarProtocolo(attempt);

      try {
        const candidato = await this.prisma.candidato.create({
          data: {
            ...candidatoData,
            inscricoes: {
              create: {
                protocolo,
                etapas: {
                  create: ETAPAS.map(etapa => ({ etapa, status: 'PENDENTE' as const })),
                },
              },
            },
          },
          include: {
            inscricoes: { take: 1, orderBy: { createdAt: 'desc' } },
          },
        });

        this.mail.enviarConfirmacaoInscricao({
          nome: candidato.nome,
          email: candidato.email,
          protocolo,
        }).catch(() => {});

        return { protocolo, nome: candidato.nome, email: candidato.email };
      } catch (e: any) {
        // Conflito de protocolo → tenta com próximo número
        if (e?.code === 'P2002' && JSON.stringify(e?.meta?.target ?? '').includes('protocolo')) {
          continue;
        }
        throw e;
      }
    }

    throw new ConflictException('Não foi possível gerar um protocolo único. Tente novamente.');
  }
}
