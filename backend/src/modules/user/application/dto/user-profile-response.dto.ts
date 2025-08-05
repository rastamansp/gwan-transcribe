import { ApiProperty } from '@nestjs/swagger';

export class UserProfileResponseDto {
  @ApiProperty({
    description: 'ID único do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
  })
  name: string;

  @ApiProperty({
    description: 'Status ativo do usuário',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Data de criação da conta',
    example: '2025-01-04T20:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data do último login',
    example: '2025-01-04T20:30:00.000Z',
    required: false,
  })
  lastLoginAt?: Date;

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2025-01-04T20:30:00.000Z',
    required: false,
  })
  updatedAt?: Date;
} 