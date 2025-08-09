import { Injectable, Inject } from '@nestjs/common';
import { ITranscriptionRepository } from '../../domain/repositories/transcription.repository.interface';
import { Transcription } from '../../domain/entities/transcription.entity';
import { TranscriptionResponseDto } from '../dto/transcription-response.dto';

export interface GetTranscriptionsRequest {
  userId: string;
}

@Injectable()
export class GetTranscriptionsUseCase {
  constructor(
    @Inject('TRANSCRIPTION_REPOSITORY')
    private readonly transcriptionRepository: ITranscriptionRepository,
  ) {}

  async execute(request: GetTranscriptionsRequest): Promise<TranscriptionResponseDto[]> {
    const { userId } = request;

    const transcriptions = await this.transcriptionRepository.findByUserId(userId);

    return transcriptions.map(transcription => this.mapToResponseDto(transcription));
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
