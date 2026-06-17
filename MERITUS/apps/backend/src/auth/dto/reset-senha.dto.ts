import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ResetSenhaDto {
  @IsString() @IsNotEmpty() cpf: string;
  @IsString() @IsNotEmpty() dataNascimento: string;
  @IsString() @MinLength(6) novaSenha: string;
}
