import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { ResetSenhaDto } from './dto/reset-senha.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const candidato = await this.prisma.candidato.findFirst({
      where: { email: dto.email },
    });

    if (!candidato || !candidato.senha) {
      throw new UnauthorizedException('E-mail não encontrado. Verifique se você realizou a inscrição.');
    }

    const senhaOk = await bcrypt.compare(dto.senha, candidato.senha);
    if (!senhaOk) {
      throw new UnauthorizedException('Senha incorreta.');
    }

    const payload = { sub: candidato.id, cpf: candidato.cpf, nome: candidato.nome, role: 'candidato' };
    const token = this.jwt.sign(payload);

    return {
      access_token: token,
      candidato: {
        id: candidato.id,
        nome: candidato.nome,
        cpf: candidato.cpf,
        email: candidato.email,
      },
    };
  }

  async resetSenha(dto: ResetSenhaDto) {
    const cpf = dto.cpf.replace(/\D/g, '');
    const candidato = await this.prisma.candidato.findFirst({ where: { cpf } });

    if (!candidato) {
      throw new UnauthorizedException('CPF não encontrado.');
    }

    // Comparar apenas a parte da data, sem conversão de timezone
    const dataDoBanco = candidato.dataNasc.toISOString().slice(0, 10);
    const dataFornecida = String(dto.dataNascimento).slice(0, 10);

    if (dataDoBanco !== dataFornecida) {
      throw new UnauthorizedException('Data de nascimento incorreta.');
    }

    const hash = await bcrypt.hash(dto.novaSenha, 10);
    await this.prisma.candidato.update({
      where: { id: candidato.id },
      data: { senha: hash },
    });

    return { message: 'Senha atualizada com sucesso.' };
  }

  async adminLogin(dto: AdminLoginDto) {
    const adminLogin = this.config.get<string>('ADMIN_LOGIN');
    const adminSenha = this.config.get<string>('ADMIN_SENHA');

    // Superadmin via variáveis de ambiente
    if (dto.login === adminLogin && dto.senha === adminSenha) {
      const payload = { sub: 'admin', role: 'admin', nome: 'Administrador Geral' };
      return { access_token: this.jwt.sign(payload) };
    }

    // Membro da comissão via banco (login = CPF formatado ou cru)
    const cpf = dto.login.replace(/\D/g, '');
    const membro = await this.prisma.membroComissao.findFirst({
      where: { OR: [{ cpf }, { email: dto.login }], ativo: true },
    });

    if (!membro) throw new UnauthorizedException('Credenciais inválidas.');

    const senhaOk = await bcrypt.compare(dto.senha, membro.senhaHash);
    if (!senhaOk) throw new UnauthorizedException('Credenciais inválidas.');

    const payload = { sub: membro.id, role: 'comissao', nome: membro.nome, cpf: membro.cpf, permissao: membro.permissao };
    return { access_token: this.jwt.sign(payload) };
  }
}
