import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ITranscriptionRepository } from '../../domain/repositories/transcription.repository.interface';
import { Transcription } from '../../domain/entities/transcription.entity';
import { TranscriptionResponseDto } from '../dto/transcription-response.dto';

export interface GetTranscriptionRequest {
  id: string;
  userId: string;
}

@Injectable()
export class GetTranscriptionUseCase {
  constructor(
    @Inject('TRANSCRIPTION_REPOSITORY')
    private readonly transcriptionRepository: ITranscriptionRepository,
  ) {}

  async execute(request: GetTranscriptionRequest): Promise<TranscriptionResponseDto> {
    const { id, userId } = request;

    const transcription = await this.transcriptionRepository.findById(id);

    if (!transcription) {
      throw new NotFoundException('Transcrição não encontrada');
    }

    if (transcription.userId !== userId) {
      throw new NotFoundException('Transcrição não encontrada');
    }

    return this.mapToResponseDto(transcription);
  }

  private mapToResponseDto(transcription: Transcription): TranscriptionResponseDto {
    return {
      id: transcription.id,
      userId: transcription.userId,
      fileUrl: transcription.fileUrl,
      originalFilename: transcription.originalFilename,
      fileSize: transcription.fileSize,
      detectedLanguage: transcription.detectedLanguage,
      selectedLanguage: transcription.selectedLanguage,
      transcriptionText: transcription.transcriptionText,
      translationText: transcription.translationText,
      duration: transcription.duration,
      status: transcription.status,
      processingStage: transcription.processingStage,
      errorMessage: transcription.errorMessage,
      processingStartedAt: transcription.processingStartedAt,
      processingCompletedAt: transcription.processingCompletedAt,
      createdAt: transcription.createdAt,
      updatedAt: transcription.updatedAt,
    };
  }
}
