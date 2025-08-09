import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// Entities
import { Transcription } from './domain/entities/transcription.entity';

// Repositories
import { TranscriptionRepository } from './infrastructure/repositories/transcription.repository';
import { ITranscriptionRepository } from './domain/repositories/transcription.repository.interface';

// Services
import { StorageService } from './infrastructure/services/storage.service';
import { QueueService } from './infrastructure/services/queue.service';
import { IStorageService } from './domain/services/storage.service.interface';
import { IQueueService } from './domain/services/queue.service.interface';

// Use Cases
import { UploadTranscriptionUseCase } from './application/use-cases/upload-transcription.use-case';
import { GetTranscriptionUseCase } from './application/use-cases/get-transcription.use-case';
import { GetTranscriptionsUseCase } from './application/use-cases/get-transcriptions.use-case';

// Controllers
import { TranscriptionController } from './infrastructure/controllers/transcription.controller';
// Importar UserModule para disponibilizar AuthGuard/JwtService no contexto
import { UserModule } from '../user/user.module';
import { SharedModule } from '../../shared/shared.module';

// Tokens
const TRANSCRIPTION_REPOSITORY = 'TRANSCRIPTION_REPOSITORY';
const STORAGE_SERVICE = 'STORAGE_SERVICE';
const QUEUE_SERVICE = 'QUEUE_SERVICE';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Transcription]),
    UserModule,
    SharedModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret')!,
        signOptions: { expiresIn: configService.get<string>('jwt.expiresIn', '30m') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [TranscriptionController],
  providers: [
    // Use Cases
    UploadTranscriptionUseCase,
    GetTranscriptionUseCase,
    GetTranscriptionsUseCase,

    // Repositories
    {
      provide: TRANSCRIPTION_REPOSITORY,
      useClass: TranscriptionRepository,
    },

    // Services
    {
      provide: STORAGE_SERVICE,
      useClass: StorageService,
    },
    {
      provide: QUEUE_SERVICE,
      useClass: QueueService,
    },
  ],
  exports: [
    UploadTranscriptionUseCase,
    GetTranscriptionUseCase,
    GetTranscriptionsUseCase,
    TRANSCRIPTION_REPOSITORY,
    STORAGE_SERVICE,
    QUEUE_SERVICE,
  ],
})
export class TranscriptionModule {}
