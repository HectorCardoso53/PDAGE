import { Module } from '@nestjs/common';
import { InscricaoController } from './inscricao.controller';
import { InscricaoService } from './inscricao.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [InscricaoController],
  providers: [InscricaoService],
})
export class InscricaoModule {}
