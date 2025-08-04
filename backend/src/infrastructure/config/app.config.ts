import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  name: process.env.APP_NAME || 'Gwan Transcribe API',
  port: parseInt(process.env.PORT || '3000', 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
}));

export const databaseConfig = registerAs('database', () => ({
  url: process.env.DATABASE_URL || '',
}));

export const azureOpenAIConfig = registerAs('azureOpenAI', () => ({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT || '',
  apiKey: process.env.AZURE_OPENAI_API_KEY || '',
}));

export const openAIConfig = registerAs('openAI', () => ({
  apiKey: process.env.OPENAI_API_KEY || '',
}));

export const minioConfig = registerAs('minio', () => ({
  endpoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000', 10) || 9000,
  accessKey: process.env.MINIO_ACCESS_KEY || 'admin',
  secretKey: process.env.MINIO_SECRET_KEY || 'password',
  bucketName: process.env.MINIO_BUCKET_NAME || 'gwan-transcribe-audio',
  useSSL: process.env.MINIO_USE_SSL === 'true',
}));

export const rabbitMQConfig = registerAs('rabbitMQ', () => ({
  url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  user: process.env.RABBITMQ_USER || 'admin',
  pass: process.env.RABBITMQ_PASS || 'password',
}));

export const emailConfig = registerAs('email', () => ({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587', 10) || 587,
  user: process.env.EMAIL_USER || '',
  pass: process.env.EMAIL_PASS || '',
  from: process.env.EMAIL_FROM || 'noreply@gwan.br',
}));

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'your-jwt-secret-key',
  expiresIn: process.env.JWT_EXPIRES_IN || '30m',
}));

export const otpConfig = registerAs('otp', () => ({
  expiresIn: process.env.OTP_EXPIRES_IN || '30m',
  maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS || '3', 10) || 3,
  length: parseInt(process.env.OTP_LENGTH || '6', 10) || 6,
}));

export const fileUploadConfig = registerAs('fileUpload', () => ({
  maxFileSize: process.env.MAX_FILE_SIZE || '100mb',
  allowedAudioTypes: process.env.ALLOWED_AUDIO_TYPES?.split(',') || [
    'mp3',
    'wav',
    'm4a',
    'aac',
    'flac',
    'ogg',
    'webm',
  ],
})); 