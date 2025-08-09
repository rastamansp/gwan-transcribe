import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { IStorageService } from '../../domain/services/storage.service.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService implements IStorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly minioClient: Minio.Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>('minio.bucketName', 'gwan-transcribe-audio');
    
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get<string>('minio.endpoint', 'localhost'),
      port: this.configService.get<number>('minio.port', 9000),
      useSSL: this.configService.get<boolean>('minio.useSSL', false),
      accessKey: this.configService.get<string>('minio.accessKey', 'admin'),
      secretKey: this.configService.get<string>('minio.secretKey', 'password'),
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const buffer: Buffer | null = file.buffer
      ? file.buffer
      : ((file as any).path
        ? await fs.promises.readFile((file as any).path as string)
        : null);

    if (!buffer) {
      this.logger.error('Buffer do arquivo não disponível');
      throw new Error('Arquivo inválido para upload');
    }

    try {
      await this.minioClient.putObject(
        this.bucketName,
        fileName,
        buffer,
        buffer.length,
        {
          'Content-Type': file.mimetype,
        }
      );

      const fileUrl = await this.getFileUrl(fileName);
      this.logger.log(`Arquivo ${fileName} enviado com sucesso para ${fileUrl}`);
      return fileUrl;
    } catch (error: any) {
      this.logger.error(`Erro ao fazer upload do arquivo (MinIO): ${error?.message || error}`);
      // Fallback para salvar em disco em ambiente de desenvolvimento
      try {
        // Salvar sempre em uma pasta 'uploads' relativa ao diretório atual da aplicação
        const uploadsDir = path.resolve(process.cwd(), 'uploads');
        await fs.promises.mkdir(uploadsDir, { recursive: true });
        const targetPath = path.join(uploadsDir, fileName);
        await fs.promises.writeFile(targetPath, buffer);
        const fileUrl = `file://${targetPath.replace(/\\/g, '/')}`;
        this.logger.warn(`MinIO indisponível. Arquivo salvo localmente em ${fileUrl}`);
        return fileUrl;
      } catch (fallbackError: any) {
        this.logger.error(`Falha no fallback de upload local: ${fallbackError?.message || fallbackError}`);
        throw new Error('Erro ao fazer upload do arquivo');
      }
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const fileName = this.extractFileNameFromUrl(fileUrl);
      await this.minioClient.removeObject(this.bucketName, fileName);
      this.logger.log(`Arquivo ${fileName} deletado com sucesso`);
    } catch (error) {
      this.logger.error(`Erro ao deletar arquivo: ${error.message}`);
      throw new Error('Erro ao deletar arquivo');
    }
  }

  async getFileUrl(fileName: string): Promise<string> {
    try {
      const useSSL = this.configService.get<boolean>('minio.useSSL', false);
      const endpoint = this.configService.get<string>('minio.endpoint', 'localhost');
      const port = this.configService.get<number>('minio.port', 9000);
      const envDomain = process.env.MINIO_DOMAIN;
      const base = envDomain && envDomain.trim().length > 0
        ? envDomain.replace(/\/$/, '')
        : `${useSSL ? 'https' : 'http'}://${endpoint}${((useSSL && port === 443) || (!useSSL && port === 80)) ? '' : `:${port}`}`;
      return `${base}/${this.bucketName}/${fileName}`;
    } catch (error) {
      this.logger.error(`Erro ao gerar URL do arquivo: ${error.message}`);
      throw new Error('Erro ao gerar URL do arquivo');
    }
  }

  private extractFileNameFromUrl(fileUrl: string): string {
    const urlParts = fileUrl.split('/');
    return urlParts[urlParts.length - 1] || '';
  }
}
