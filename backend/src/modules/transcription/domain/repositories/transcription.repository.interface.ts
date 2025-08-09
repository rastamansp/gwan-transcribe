import { Transcription, TranscriptionStatus } from '../entities/transcription.entity';

export interface ITranscriptionRepository {
  create(transcription: Partial<Transcription>): Promise<Transcription>;
  findById(id: string): Promise<Transcription | null>;
  findByUserId(userId: string): Promise<Transcription[]>;
  update(id: string, updates: Partial<Transcription>): Promise<Transcription>;
  updateStatus(id: string, status: TranscriptionStatus): Promise<Transcription>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Transcription[]>;
}
