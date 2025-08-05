import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';


// Configurações
import {
  appConfig,
  databaseConfig,
  azureOpenAIConfig,
  openAIConfig,
  minioConfig,
  rabbitMQConfig,
  emailConfig,
  jwtConfig,
  otpConfig,
  fileUploadConfig,
} from './infrastructure/config/app.config';
import { loggerConfig } from './infrastructure/config/logger.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Módulos da aplicação
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
// import { TranscriptionModule } from './modules/transcription/transcription.module';
// import { FileModule } from './modules/file/file.module';
// import { HistoryModule } from './modules/history/history.module';

@Module({
  imports: [
    // Configuração de variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        azureOpenAIConfig,
        openAIConfig,
        minioConfig,
        rabbitMQConfig,
        emailConfig,
        jwtConfig,
        otpConfig,
        fileUploadConfig,
      ],
      envFilePath: '.env',
    }),

    // Configuração do banco de dados
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        url: configService.get('database.url') || 'postgresql://postgres:pazdedeus@postgres.gwan.com.br:5433/gwan_transcribe',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/infrastructure/database/migrations/*{.ts,.js}'],
        synchronize: configService.get('app.nodeEnv') === 'development',
        logging: false, // Desabilitar logging de queries
        ssl: configService.get('app.nodeEnv') === 'production' ? { rejectUnauthorized: false } : false,
      }),
      inject: [ConfigService],
    }),

    // Configuração do Bull (filas)
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: 'localhost',
          port: 6379,
        },
      }),
      inject: [ConfigService],
    }),

    // Módulos de sistema
    TerminusModule,
    ScheduleModule.forRoot(),

    // Módulos da aplicação
    AuthModule,
    UserModule,
    // TranscriptionModule,
    // FileModule,
    // HistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
