import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyOTPDto {
  @IsEmail({}, { message: 'Email deve ser válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString({ message: 'Código deve ser uma string' })
  @IsNotEmpty({ message: 'Código é obrigatório' })
  @Length(6, 6, { message: 'Código deve ter exatamente 6 dígitos' })
  code: string;
} 