/**
 * PDAGE — Plataforma Digital de Avaliação para Gestores Escolares
 * Backend API — NestJS Application Bootstrap
 *
 * This is the entry point for the NestJS backend application.
 * This is a stub for future implementation. The full API will include:
 *
 * Modules:
 *  - AuthModule:        JWT authentication, guards, strategies
 *  - UsersModule:       User management (candidates, admins, secretaria)
 *  - InscricoesModule:  Registration and inscription flow
 *  - DocumentosModule:  Document upload and validation
 *  - AvaliacoesModule:  Evaluation stages management
 *  - PontuacoesModule:  Score calculation and ranking
 *  - RecursosModule:    Appeals and contestations
 *  - CertificadosModule: Digital certificate generation
 *  - LogsModule:        Administrative audit logs
 *  - RelatoriosModule:  Reports and analytics
 *
 * Database: PostgreSQL via Prisma ORM
 * Auth: JWT + Passport with RBAC (candidato | admin | secretaria)
 */

import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get } from '@nestjs/common';

@Controller()
class AppController {
  @Get()
  getRoot(): object {
    return {
      name: 'PDAGE API',
      description: 'Plataforma Digital de Avaliação para Gestores Escolares',
      version: '1.0.0',
      status: 'em desenvolvimento',
      municipality: 'Óbidos/PA',
      organization: 'Secretaria Municipal de Educação',
    };
  }

  @Get('health')
  getHealth(): object {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}

@Module({
  imports: [],
  controllers: [AppController],
  providers: [],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // CORS configuration
  app.enableCors({
    origin: process.env.CORS_ORIGIN || [
      'http://localhost:3000',
      'https://pdage.obidos.pa.gov.br',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Global prefix for all API routes
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`\n🚀 PDAGE API rodando na porta ${port}`);
  console.log(`   Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health: http://localhost:${port}/api/health\n`);
}

bootstrap();
