import { Module } from '@nestjs/common';
import { AppModule } from './app.module';
import { TranscriptionModule } from './modules/transcription/transcription.module';
import { TranscriptionConsumer } from './modules/transcription/infrastructure/workers/transcription.consumer';

@Module({
  imports: [AppModule, TranscriptionModule],
  providers: [TranscriptionConsumer],
})
export class WorkerModule {}


