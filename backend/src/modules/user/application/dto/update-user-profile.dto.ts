import { IsEmail, IsString, MaxLength, MinLength, ValidateIf, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserProfileDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
    required: false,
    minLength: 2,
    maxLength: 100,
  })
  @ValidateIf((o) => o.name !== null && o.name !== undefined && o.name !== '')
  @IsNotEmpty({ message: 'Nome não pode ser vazio' })
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  name?: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@example.com',
    required: false,
    format: 'email',
  })
  @ValidateIf((o) => o.email !== null && o.email !== undefined && o.email !== '')
  @IsNotEmpty({ message: 'Email não pode ser vazio' })
  @IsEmail({}, { message: 'Email deve ser válido' })
  email?: string;
} 