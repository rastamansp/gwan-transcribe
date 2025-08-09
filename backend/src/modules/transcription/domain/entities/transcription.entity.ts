import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../../auth/domain/entities/user.entity';

export enum TranscriptionStatus {
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  TRANSCRIBING = 'transcribing',
  TRANSLATING = 'translating',
  COMPLETED = 'completed',
  ERROR = 'error',
}

export enum ProcessingStage {
  UPLOAD = 'upload',
  VALIDATION = 'validation',
  TRANSCRIPTION = 'transcription',
  TRANSLATION = 'translation',
  COMPLETED = 'completed',
  ERROR = 'error',
}

@Entity('transcriptions')
export class Transcription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'file_url' })
  fileUrl: string;

  @Column({ name: 'original_filename' })
  originalFilename: string;

  @Column({ name: 'file_size', type: 'integer' })
  fileSize: number;

  @Column({ name: 'detected_language', type: 'varchar', length: 10, nullable: true })
  detectedLanguage: string | null;

  @Column({ name: 'selected_language', type: 'varchar', length: 10, nullable: true })
  selectedLanguage: string | null;

  @Column({ name: 'transcription_text', type: 'text', nullable: true })
  transcriptionText: string | null;

  @Column({ name: 'translation_text', type: 'text', nullable: true })
  translationText: string | null;

  @Column({ name: 'duration', type: 'integer', nullable: true })
  duration: number | null;

  @Column({
    type: 'enum',
    enum: TranscriptionStatus,
    default: TranscriptionStatus.UPLOADING,
  })
  status: TranscriptionStatus;

  @Column({
    name: 'processing_stage',
    type: 'enum',
    enum: ProcessingStage,
    default: ProcessingStage.UPLOAD,
  })
  processingStage: ProcessingStage;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string | null;

  @Column({ name: 'processing_started_at', type: 'timestamp', nullable: true })
  processingStartedAt: Date | null;

  @Column({ name: 'processing_completed_at', type: 'timestamp', nullable: true })
  processingCompletedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
