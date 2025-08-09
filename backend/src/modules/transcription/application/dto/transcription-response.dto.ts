import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TranscriptionStatus, ProcessingStage } from '../../domain/entities/transcription.entity';

export class TranscriptionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  fileUrl: string;

  @ApiProperty()
  originalFilename: string;

  @ApiProperty()
  fileSize: number;

  @ApiPropertyOptional()
  detectedLanguage?: string | null;

  @ApiPropertyOptional()
  selectedLanguage?: string | null;

  @ApiPropertyOptional()
  transcriptionText?: string | null;

  @ApiPropertyOptional()
  translationText?: string | null;

  @ApiPropertyOptional()
  duration?: number | null;

  @ApiProperty({ enum: TranscriptionStatus })
  status: TranscriptionStatus;

  @ApiProperty({ enum: ProcessingStage })
  processingStage: ProcessingStage;

  @ApiPropertyOptional()
  errorMessage?: string | null;

  @ApiPropertyOptional()
  processingStartedAt?: Date | null;

  @ApiPropertyOptional()
  processingCompletedAt?: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
