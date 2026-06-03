import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { AdminLoginDto } from './dto/admin-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const cpf = dto.cpf.replace(/\D/g, '');

    const candidato = await this.prisma.candidato.findUnique({
      where: { cpf },
    });

    if (!candidato || !candidato.senha) {
      throw new UnauthorizedException('CPF não encontrado. Verifique se você realizou a inscrição.');
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

  async adminLogin(dto: AdminLoginDto) {
    const adminLogin = this.config.get<string>('ADMIN_LOGIN');
    const adminSenha = this.config.get<string>('ADMIN_SENHA');

    if (dto.login !== adminLogin || dto.senha !== adminSenha) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const payload = { sub: 'admin', role: 'admin', nome: 'Administrador' };
    return { access_token: this.jwt.sign(payload) };
  }
}
