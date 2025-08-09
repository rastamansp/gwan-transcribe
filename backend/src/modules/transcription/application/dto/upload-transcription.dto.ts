import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Language {
  PT = 'pt',
  EN = 'en',
}

export class UploadTranscriptionDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;

  @ApiPropertyOptional({ enum: Language, description: 'Idioma selecionado para transcrição' })
  @IsOptional()
  @IsEnum(Language)
  language?: Language;
}
