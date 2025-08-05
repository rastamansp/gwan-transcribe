import { Injectable, Inject } from '@nestjs/common';
import { IUserStatisticsService } from '../../domain/services/user-statistics.service.interface';
import { UserStatisticsResponseDto } from '../../application/dto/user-statistics-response.dto';
import { IUserProfileRepository, USER_PROFILE_REPOSITORY } from '../../domain/repositories/user-profile.repository.interface';
import { CustomLoggerService } from '../../../../shared/services/logger.service';

@Injectable()
export class UserStatisticsService implements IUserStatisticsService {
  constructor(
    @Inject(USER_PROFILE_REPOSITORY)
    private readonly userRepository: IUserProfileRepository,
    private readonly logger: CustomLoggerService,
  ) {}

  async getUserStatistics(userId: string): Promise<UserStatisticsResponseDto> {
    this.logger.log(`Calculando estatísticas para usuário: ${userId}`, 'UserStatisticsService');
    
    const statistics = await this.userRepository.getStatistics(userId);
    
    if (!statistics) {
      this.logger.warn(`Estatísticas não encontradas para usuário: ${userId}`, 'UserStatisticsService');
      throw new Error('Estatísticas não encontradas');
    }

    return {
      totalTranscriptions: statistics.totalTranscriptions,
      totalMinutes: statistics.totalMinutes,
      averageAccuracy: statistics.averageAccuracy,
      lastTranscription: statistics.lastTranscription,
      preferredLanguage: statistics.preferredLanguage,
      accountCreatedAt: statistics.accountCreatedAt,
      daysSinceLastUse: statistics.daysSinceLastUse,
    };
  }

  async calculateUsageMetrics(userId: string): Promise<any> {
    this.logger.log(`Calculando métricas de uso para usuário: ${userId}`, 'UserStatisticsService');
    
    // Implementar quando módulo de transcrição estiver pronto
    return {
      totalTranscriptions: 0,
      totalMinutes: 0,
      averageAccuracy: 0,
    };
  }

  async getPreferredLanguage(userId: string): Promise<string | null> {
    this.logger.log(`Buscando idioma preferido para usuário: ${userId}`, 'UserStatisticsService');
    
    // Implementar quando módulo de transcrição estiver pronto
    return null;
  }
} 