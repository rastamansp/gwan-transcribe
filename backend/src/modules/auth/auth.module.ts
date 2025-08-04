import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Shared
import { SharedModule } from '../../shared/shared.module';

// Entities
import { User } from './domain/entities/user.entity';
import { OTP } from './domain/entities/otp.entity';

// Repositories
import { UserRepository } from './infrastructure/repositories/user.repository';
import { OTPRepository } from './infrastructure/repositories/otp.repository';

// Services
import { EmailService } from './infrastructure/services/email.service';

// Use Cases
import { RequestOTPUseCase } from './application/use-cases/request-otp.use-case';
import { VerifyOTPUseCase } from './application/use-cases/verify-otp.use-case';

// Controllers
import { AuthController } from './infrastructure/controllers/auth.controller';

@Module({
  imports: [
    ConfigModule,
    SharedModule,
    TypeOrmModule.forFeature([User, OTP]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('jwt.secret');
        if (!secret) {
          throw new Error('JWT secret não configurado');
        }
        
        return {
          secret,
          signOptions: {
            expiresIn: configService.get<string>('jwt.expiresIn', '30m'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Use Cases
    RequestOTPUseCase,
    VerifyOTPUseCase,

    // Repositories
    UserRepository,
    OTPRepository,

    // Services
    EmailService,
  ],
  exports: [
    RequestOTPUseCase,
    VerifyOTPUseCase,
    UserRepository,
    OTPRepository,
    EmailService,
  ],
})
export class AuthModule {} 