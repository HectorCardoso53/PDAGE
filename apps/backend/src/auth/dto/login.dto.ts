import { IsString, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @Matches(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, { message: 'CPF inválido' })
  cpf: string;

  @IsString()
  dataNasc: string;
}
