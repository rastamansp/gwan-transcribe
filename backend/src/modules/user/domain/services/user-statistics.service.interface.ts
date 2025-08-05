import { UserStatisticsResponseDto } from '../../application/dto/user-statistics-response.dto';

export const USER_STATISTICS_SERVICE = 'USER_STATISTICS_SERVICE';

export interface IUserStatisticsService {
  getUserStatistics(userId: string): Promise<UserStatisticsResponseDto>;
  calculateUsageMetrics(userId: string): Promise<any>;
  getPreferredLanguage(userId: string): Promise<string | null>;
} 