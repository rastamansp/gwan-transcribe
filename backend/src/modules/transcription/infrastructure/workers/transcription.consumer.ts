import { Injectable, Logger, OnModuleDestroy, OnModuleInit, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import axios from 'axios';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import OpenAI from 'openai';
import * as Minio from 'minio';
import { ITranscriptionRepository } from '../../domain/repositories/transcription.repository.interface';
import { ProcessingStage, TranscriptionStatus } from '../../domain/entities/transcription.entity';

interface TranscriptionJob {
  transcriptionId: string;
  fileUrl: string;
  language?: string;
}

@Injectable()
export class TranscriptionConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TranscriptionConsumer.name);
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
  private readonly transcriptionQueueName = 'transcription-queue';
  private openai: OpenAI | null = null;
  private minioClient: Minio.Client | null = null;
  private minioBucket: string | null = null;

  constructor(
    private readonly configService: ConfigService,
    @Inject('TRANSCRIPTION_REPOSITORY')
    private readonly transcriptionRepository: ITranscriptionRepository,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      const openaiApiKey = this.configService.get<string>('openAI.apiKey');
      const useOpenAI = process.env.OPENAI_USE === 'true';
      if (openaiApiKey && useOpenAI) {
        this.openai = new OpenAI({ apiKey: openaiApiKey });
        this.logger.log('OpenAI client inicializado');
      } else {
        this.logger.warn('OpenAI desabilitado (defina OPENAI_USE=true e OPENAI_API_KEY).');
      }

      // Inicializar MinIO client
      try {
        const endPoint = this.configService.get<string>('minio.endpoint', 'localhost');
        const port = this.configService.get<number>('minio.port', 9000);
        const useSSL = this.configService.get<boolean>('minio.useSSL', false);
        const accessKey = this.configService.get<string>('minio.accessKey', 'admin');
        const secretKey = this.configService.get<string>('minio.secretKey', 'password');
        this.minioBucket = this.configService.get<string>('minio.bucketName', 'gwan-transcribe-audio');
        this.minioClient = new Minio.Client({ endPoint, port, useSSL, accessKey, secretKey });
        this.logger.log('MinIO client inicializado no worker');
      } catch (e) {
        this.logger.warn('Falha ao inicializar MinIO client no worker');
      }
      await this.ensureConnection();
      await this.consumeTranscriptions();
      this.logger.log('Consumer de transcrição iniciado');
    } catch (error: any) {
      this.logger.error(`Falha ao iniciar consumer de transcrição: ${error?.message || error}`);
    }
  }

  private async ensureConnection(): Promise<void> {
    if (this.connection && this.channel) return;
    const rabbitmqUrl = this.configService.get<string>('rabbitMQ.url', 'amqp://localhost:5672');
    const connection = (await amqp.connect(rabbitmqUrl)) as any;
    this.connection = connection as any;
    const channel = await (connection as any).createChannel();
    this.channel = channel as any;
    await (this.channel as any).assertQueue(this.transcriptionQueueName, { durable: true });
  }

  private async consumeTranscriptions(): Promise<void> {
    if (!this.channel) throw new Error('Canal RabbitMQ não disponível');
    await this.channel.consume(this.transcriptionQueueName, async (msg) => {
      if (!msg) return;
      try {
        const content = msg.content.toString();
        const job: TranscriptionJob = JSON.parse(content);
        await this.processJob(job);
        this.channel!.ack(msg);
      } catch (error: any) {
        this.logger.error(`Erro ao processar mensagem: ${error?.message || error}`);
        this.channel!.nack(msg, false, false); // descarta mensagem com erro irrecuperável
      }
    }, { noAck: false });
  }

  private async processJob(job: TranscriptionJob): Promise<void> {
    const { transcriptionId, fileUrl, language } = job;
    this.logger.log(`Processando transcrição ${transcriptionId} (fileUrl=${fileUrl})`);

    // Atualiza status para PROCESSING
    await this.transcriptionRepository.update(transcriptionId, {
      status: TranscriptionStatus.PROCESSING,
      processingStage: ProcessingStage.TRANSCRIPTION,
      processingStartedAt: new Date(),
    });

    try {
      const tempFilePath = await this.downloadToTemp(fileUrl);

      if (!this.openai) {
        throw new Error('OpenAI não configurado. Defina OPENAI_USE=true e OPENAI_API_KEY');
      }

      const fileStream = fs.createReadStream(tempFilePath);
      const result = await this.openai.audio.transcriptions.create({
        file: fileStream as any,
        model: 'whisper-1',
      } as any);

      const text: string | null = (result as any)?.text || null;
      if (!text) {
        throw new Error('Transcrição retornou vazia');
      }

      const detectedLanguage = language || 'pt';

      await this.transcriptionRepository.update(transcriptionId, {
        transcriptionText: text,
        detectedLanguage,
        processingStage: ProcessingStage.COMPLETED,
        status: TranscriptionStatus.COMPLETED,
        processingCompletedAt: new Date(),
      });

      this.logger.log(`Transcrição ${transcriptionId} concluída com Whisper`);
    } catch (error: any) {
      const detail = (error && error.response && error.response.data) ? JSON.stringify(error.response.data) : '';
      this.logger.error(`Falha no processamento da transcrição ${transcriptionId}: ${error?.message || error} ${detail}`);
      await this.transcriptionRepository.update(transcriptionId, {
        status: TranscriptionStatus.ERROR,
        processingStage: ProcessingStage.ERROR,
        errorMessage: error?.message || 'Erro no processamento',
        processingCompletedAt: new Date(),
      });
    }
  }

  private async downloadToTemp(fileUrl: string): Promise<string> {
    // Suporta file:// e http(s):// e MinIO privado via SDK
    if (fileUrl.startsWith('file://')) {
      const p = path.normalize(fileUrl.replace('file://', ''));
      if (!fs.existsSync(p)) throw new Error('Arquivo local não encontrado');
      return p;
    }

    // Tentar via MinIO SDK (privado)
    if (this.minioClient && this.minioBucket) {
      try {
        const nameFromUrl = this.extractFileName(fileUrl);
        if (!nameFromUrl) throw new Error('Nome de arquivo inválido');
        const tempDir = path.resolve(process.cwd(), 'tmp');
        await fs.promises.mkdir(tempDir, { recursive: true });
        const tempPath = path.join(tempDir, `${Date.now()}-${nameFromUrl}`);
        const stream = await this.minioClient.getObject(this.minioBucket, nameFromUrl);
        await new Promise<void>((resolve, reject) => {
          const writer = fs.createWriteStream(tempPath);
          stream.pipe(writer);
          writer.on('finish', resolve);
          writer.on('error', reject);
        });
        return tempPath;
      } catch (e) {
        // prosseguir para HTTP
      }
    }
    const tempDir = path.resolve(process.cwd(), 'tmp');
    await fs.promises.mkdir(tempDir, { recursive: true });
    const urlName = this.extractFileName(fileUrl) || `${Date.now()}-${Math.random().toString(36).slice(2)}.bin`;
    const tempPath = path.join(tempDir, urlName);

    // Permitir certificados válidos em prod; se MINIO_USE_SSL=true, confiar no domínio configurado
    const isHttps = fileUrl.startsWith('https://');
    const agent = isHttps ? new https.Agent({ rejectUnauthorized: true }) : undefined;
    const response = await axios.get(fileUrl, {
      responseType: 'stream',
      httpsAgent: agent,
      timeout: 15000,
      headers: {
        // S3/MinIO geralmente não precisam de auth para leitura pública; se precisar, adicionar aqui
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    await new Promise<void>((resolve, reject) => {
      const writer = fs.createWriteStream(tempPath);
      response.data.pipe(writer);
      writer.on('finish', () => resolve());
      writer.on('error', (err) => reject(err));
    });
    return tempPath;
  }

  private extractFileName(fileUrl: string): string {
    const parts = fileUrl.split('/');
    return parts[parts.length - 1] || '';
  }

  async onModuleDestroy(): Promise<void> {
    try {
      if (this.channel) await (this.channel as any).close();
      if (this.connection) await (this.connection as any).close();
    } catch (error: any) {
      this.logger.error(`Erro ao finalizar consumer: ${error?.message || error}`);
    } finally {
      this.channel = null;
      this.connection = null;
    }
  }
}


