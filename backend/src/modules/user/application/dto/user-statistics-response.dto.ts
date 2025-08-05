import { ApiProperty } from '@nestjs/swagger';

export class UserStatisticsResponseDto {
  @ApiProperty({
    description: 'Total de transcrições realizadas',
    example: 15,
  })
  totalTranscriptions: number;

  @ApiProperty({
    description: 'Total de minutos transcritos',
    example: 120.5,
  })
  totalMinutes: number;

  @ApiProperty({
    description: 'Precisão média das transcrições (%)',
    example: 95.2,
  })
  averageAccuracy: number;

  @ApiProperty({
    description: 'Data da última transcrição',
    example: '2025-01-04T20:30:00.000Z',
    required: false,
  })
  lastTranscription?: Date;

  @ApiProperty({
    description: 'Idioma preferido do usuário',
    example: 'pt-BR',
    required: false,
  })
  preferredLanguage?: string;

  @ApiProperty({
    description: 'Data de criação da conta',
    example: '2025-01-04T20:30:00.000Z',
  })
  accountCreatedAt: Date;

  @ApiProperty({
    description: 'Dias desde o último uso',
    example: 2,
  })
  daysSinceLastUse: number;
} 