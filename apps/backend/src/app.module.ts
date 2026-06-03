import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CandidatoModule } from './candidato/candidato.module';
import { InscricaoModule } from './inscricao/inscricao.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    CandidatoModule,
    InscricaoModule,
    AdminModule,
  ],
})
export class AppModule {}
