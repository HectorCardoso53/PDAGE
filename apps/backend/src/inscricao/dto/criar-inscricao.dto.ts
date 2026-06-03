import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CriarInscricaoDto {
  @IsString() @IsNotEmpty() nome: string;
  @IsString() @IsNotEmpty() cpf: string;
  @IsString() @IsNotEmpty() dataNasc: string;
  @IsString() @IsNotEmpty() sexo: string;
  @IsEmail()  @IsNotEmpty() email: string;
  @IsString() @IsNotEmpty() telefone: string;
  @IsString() @IsNotEmpty() cargo: string;
  @IsString() @IsNotEmpty() escola: string;
  @IsString() @IsNotEmpty() matricula: string;

  @IsOptional() @IsString() rg?: string;
  @IsOptional() @IsString() orgaoEmissor?: string;
  @IsOptional() @IsString() estadoCivil?: string;
  @IsOptional() @IsString() cep?: string;
  @IsOptional() @IsString() logradouro?: string;
  @IsOptional() @IsString() numero?: string;
  @IsOptional() @IsString() bairro?: string;
  @IsOptional() @IsString() cidade?: string;
  @IsOptional() @IsString() municipio?: string;
  @IsOptional() @IsString() tempoServico?: string;
  @IsOptional() @IsString() formacao?: string;
  @IsOptional() @IsString() especializacao?: string;
}
