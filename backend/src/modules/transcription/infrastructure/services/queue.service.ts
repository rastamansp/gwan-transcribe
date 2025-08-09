import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { IQueueService, TranscriptionJob } from '../../domain/services/queue.service.interface';

@Injectable()
export class QueueService implements IQueueService, OnModuleDestroy {
  private readonly logger = new Logger(QueueService.name);
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
  private readonly transcriptionQueueName = 'transcription-queue';
  private readonly translationQueueName = 'translation-queue';

  constructor(private readonly configService: ConfigService) {}

  private async ensureConnection(): Promise<void> {
    if (this.connection && this.channel) {
      return;
    }

    const rabbitmqUrl = this.configService.get<string>('rabbitMQ.url', 'amqp://localhost:5672');

    const connection = (await amqp.connect(rabbitmqUrl)) as any;
    this.connection = connection as any;
    const channel = await (connection as any).createChannel();
    this.channel = channel as any;

    if (!this.channel) {
      throw new Error('Falha ao criar canal RabbitMQ');
    }

    await this.channel.assertQueue(this.transcriptionQueueName, { durable: true });
    await this.channel.assertQueue(this.translationQueueName, { durable: true });

    this.logger.log('Conexão com RabbitMQ estabelecida');
  }

  async addTranscriptionJob(job: TranscriptionJob): Promise<void> {
    try {
      await this.ensureConnection();

      if (!this.channel) {
        throw new Error('Canal não disponível');
      }

      const message = JSON.stringify(job);
      const options: amqp.Options.Publish = { persistent: true, contentType: 'application/json' };
      this.channel.sendToQueue(this.transcriptionQueueName, Buffer.from(message), options);

      this.logger.log(`Job de transcrição adicionado à fila: ${job.transcriptionId}`);
    } catch (error: any) {
      this.logger.error(`Erro ao adicionar job de transcrição: ${error.message}`);
      throw new Error('Erro ao adicionar job de transcrição');
    }
  }

  async addTranslationJob(job: TranscriptionJob): Promise<void> {
    try {
      await this.ensureConnection();

      if (!this.channel) {
        throw new Error('Canal não disponível');
      }

      const message = JSON.stringify(job);
      const options: amqp.Options.Publish = { persistent: true, contentType: 'application/json' };
      this.channel.sendToQueue(this.translationQueueName, Buffer.from(message), options);

      this.logger.log(`Job de tradução adicionado à fila: ${job.transcriptionId}`);
    } catch (error: any) {
      this.logger.error(`Erro ao adicionar job de tradução: ${error.message}`);
      throw new Error('Erro ao adicionar job de tradução');
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await (this.connection as any).close();
      }
    } catch (error: any) {
      this.logger.error(`Erro ao encerrar conexão RabbitMQ: ${error.message}`);
    } finally {
      this.channel = null;
      this.connection = null;
    }
  }
}
