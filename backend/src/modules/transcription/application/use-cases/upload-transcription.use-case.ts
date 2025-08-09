import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { ITranscriptionRepository } from '../../domain/repositories/transcription.repository.interface';
import { Transcription, TranscriptionStatus, ProcessingStage } from '../../domain/entities/transcription.entity';
import { UploadTranscriptionDto } from '../dto/upload-transcription.dto';
import { IStorageService } from '../../domain/services/storage.service.interface';
import { IQueueService } from '../../domain/services/queue.service.interface';

export interface UploadTranscriptionRequest {
  file: Express.Multer.File;
  userId: string;
  language?: string | undefined;
}

export interface UploadTranscriptionResponse {
  id: string;
  status: TranscriptionStatus;
  message: string;
}

@Injectable()
export class UploadTranscriptionUseCase {
  constructor(
    @Inject('TRANSCRIPTION_REPOSITORY')
    private readonly transcriptionRepository: ITranscriptionRepository,
    @Inject('STORAGE_SERVICE')
    private readonly storageService: IStorageService,
    @Inject('QUEUE_SERVICE')
    private readonly queueService: IQueueService,
  ) {}

  async execute(request: UploadTranscriptionRequest): Promise<UploadTranscriptionResponse> {
    const { file, userId, language } = request;

    // Validar arquivo
    this.validateFile(file);

    // Upload para storage
    const fileUrl = await this.storageService.uploadFile(file);

    // Criar transcrição no banco
    const transcription = await this.transcriptionRepository.create({
      userId,
      fileUrl,
      originalFilename: file.originalname,
      fileSize: file.size,
      selectedLanguage: language || null,
      status: TranscriptionStatus.UPLOADING,
      processingStage: ProcessingStage.UPLOAD,
    });

    // Enviar para fila de processamento
    await this.queueService.addTranscriptionJob({
      transcriptionId: transcription.id,
      fileUrl,
      ...(language && { language }),
    });

    return {
      id: transcription.id,
      status: transcription.status,
      message: 'Arquivo enviado com sucesso. Processamento iniciado.',
    };
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('Arquivo não fornecido');
    }

    const allowedTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/m4a', 'audio/aac', 'audio/flac', 'audio/ogg', 'audio/webm'];
    const hasValidMime = allowedTypes.includes(file.mimetype);
    const hasValidExt = /\.(mp3|wav|m4a|aac|flac|ogg|webm)$/i.test(file.originalname || '');
    if (!hasValidMime && !hasValidExt) {
      throw new BadRequestException('Tipo de arquivo não suportado');
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      throw new BadRequestException('Arquivo muito grande. Máximo 100MB');
    }
  }
}
