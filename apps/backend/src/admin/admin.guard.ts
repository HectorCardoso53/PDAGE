import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwt: JwtService, private config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ headers: { authorization?: string } }>();
    const auth = request.headers.authorization;

    if (!auth?.startsWith('Bearer ')) throw new ForbiddenException('Token não fornecido.');

    const token = auth.slice(7);
    try {
      const payload = this.jwt.verify<{ sub: string; role?: string }>(token, {
        secret: this.config.get<string>('JWT_SECRET') || 'meritus-secret-key',
      });
      if (payload.role !== 'admin') throw new ForbiddenException('Acesso restrito ao administrador.');
      return true;
    } catch (err) {
      if (err instanceof ForbiddenException) throw err;
      throw new ForbiddenException('Token inválido ou expirado.');
    }
  }
}
