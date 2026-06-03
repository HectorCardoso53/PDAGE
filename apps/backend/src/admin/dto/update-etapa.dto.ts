import { IsEnum, IsOptional, IsNumber, IsString } from 'class-validator';
import { StatusEtapa } from '@prisma/client';

export class UpdateEtapaDto {
  @IsEnum(StatusEtapa) status: StatusEtapa;
  @IsOptional() @IsNumber() pontuacao?: number;
  @IsOptional() @IsString() observacao?: string;
  @IsOptional() @IsString() docChecks?: string;
}
