import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transcription, TranscriptionStatus } from '../../domain/entities/transcription.entity';
import { ITranscriptionRepository } from '../../domain/repositories/transcription.repository.interface';

@Injectable()
export class TranscriptionRepository implements ITranscriptionRepository {
  constructor(
    @InjectRepository(Transcription)
    private readonly repository: Repository<Transcription>,
  ) {}

  async create(transcription: Partial<Transcription>): Promise<Transcription> {
    const newTranscription = this.repository.create(transcription);
    return await this.repository.save(newTranscription);
  }

  async findById(id: string): Promise<Transcription | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findByUserId(userId: string): Promise<Transcription[]> {
    return await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updates: Partial<Transcription>): Promise<Transcription> {
    await this.repository.update(id, updates);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Transcrição não encontrada');
    }
    return updated;
  }

  async updateStatus(id: string, status: TranscriptionStatus): Promise<Transcription> {
    return await this.update(id, { status });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findAll(): Promise<Transcription[]> {
    return await this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }
}
