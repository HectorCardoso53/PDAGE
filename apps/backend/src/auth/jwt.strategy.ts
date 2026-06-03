import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'meritus-secret-key',
    });
  }

  async validate(payload: { sub: string; cpf?: string; nome?: string; role?: string }) {
    return { id: payload.sub, cpf: payload.cpf ?? null, nome: payload.nome ?? 'Administrador', role: payload.role ?? 'candidato' };
  }
}
