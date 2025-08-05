import { Injectable, NotFoundException, UnauthorizedException, Inject } from '@nestjs/common';
import { IUserProfileRepository, USER_PROFILE_REPOSITORY } from '../../domain/repositories/user-profile.repository.interface';
import { IUserStatisticsService, USER_STATISTICS_SERVICE } from '../../domain/services/user-statistics.service.interface';
import { UserStatisticsResponseDto } from '../dto/user-statistics-response.dto';
import { CustomLoggerService } from '../../../../shared/services/logger.service';

@Injectable()
export class GetUserStatisticsUseCase {
  constructor(
    @Inject(USER_PROFILE_REPOSITORY)
    private readonly userRepository: IUserProfileRepository,
    @Inject(USER_STATISTICS_SERVICE)
    private readonly statisticsService: IUserStatisticsService,
    private readonly logger: CustomLoggerService,
  ) {}

  async execute(userId: string): Promise<UserStatisticsResponseDto> {
    this.logger.log(`Buscando estatísticas do usuário: ${userId}`, 'GetUserStatisticsUseCase');

    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      this.logger.warn(`Usuário não encontrado: ${userId}`, 'GetUserStatisticsUseCase');
      throw new NotFoundException('Usuário não encontrado');
    }

    if (!user.isActive) {
      this.logger.warn(`Usuário inativo: ${userId}`, 'GetUserStatisticsUseCase');
      throw new UnauthorizedException('Usuário inativo');
    }

    const statistics = await this.statisticsService.getUserStatistics(userId);

    this.logger.log(`Estatísticas obtidas para usuário: ${userId}`, 'GetUserStatisticsUseCase');

    return statistics;
  }
} 