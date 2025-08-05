import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Shared
import { SharedModule } from '../../shared/shared.module';

// Entities
import { User } from '../auth/domain/entities/user.entity';

// Use Cases
import { GetUserProfileUseCase } from './application/use-cases/get-user-profile.use-case';
import { UpdateUserProfileUseCase } from './application/use-cases/update-user-profile.use-case';
import { DeactivateUserUseCase } from './application/use-cases/deactivate-user.use-case';
import { ActivateUserUseCase } from './application/use-cases/activate-user.use-case';
import { GetUserStatisticsUseCase } from './application/use-cases/get-user-statistics.use-case';

// Controllers
import { UserController } from './infrastructure/controllers/user.controller';

// Guards
import { AuthGuard } from './infrastructure/guards/auth.guard';
import { UserGuard } from './infrastructure/guards/user.guard';

// Repositories
import { UserProfileRepository } from './infrastructure/repositories/user-profile.repository';
import { IUserProfileRepository, USER_PROFILE_REPOSITORY } from './domain/repositories/user-profile.repository.interface';

// Services
import { UserStatisticsService } from './infrastructure/services/user-statistics.service';
import { IUserStatisticsService, USER_STATISTICS_SERVICE } from './domain/services/user-statistics.service.interface';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([User]),
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
  controllers: [UserController],
  providers: [
    // Use Cases
    GetUserProfileUseCase,
    UpdateUserProfileUseCase,
    DeactivateUserUseCase,
    ActivateUserUseCase,
    GetUserStatisticsUseCase,

    // Guards
    AuthGuard,
    UserGuard,

    // Repositories
    UserProfileRepository,
    {
      provide: USER_PROFILE_REPOSITORY,
      useClass: UserProfileRepository,
    },

    // Services
    UserStatisticsService,
    {
      provide: USER_STATISTICS_SERVICE,
      useClass: UserStatisticsService,
    },
  ],
  exports: [
    GetUserProfileUseCase,
    UpdateUserProfileUseCase,
    DeactivateUserUseCase,
    ActivateUserUseCase,
    GetUserStatisticsUseCase,
    UserProfileRepository,
    UserStatisticsService,
  ],
})
export class UserModule {} 