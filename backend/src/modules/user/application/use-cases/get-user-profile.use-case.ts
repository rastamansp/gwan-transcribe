import { Injectable, NotFoundException, UnauthorizedException, Inject } from '@nestjs/common';
import { IUserProfileRepository, USER_PROFILE_REPOSITORY } from '../../domain/repositories/user-profile.repository.interface';
import { UserProfileResponseDto } from '../dto/user-profile-response.dto';
import { CustomLoggerService } from '../../../../shared/services/logger.service';

@Injectable()
export class GetUserProfileUseCase {
  constructor(
    @Inject(USER_PROFILE_REPOSITORY)
    private readonly userRepository: IUserProfileRepository,
    private readonly logger: CustomLoggerService,
  ) {}

  async execute(userId: string): Promise<UserProfileResponseDto> {
    this.logger.log(`Buscando perfil do usuário: ${userId}`, 'GetUserProfileUseCase');

    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      this.logger.warn(`Usuário não encontrado: ${userId}`, 'GetUserProfileUseCase');
      throw new NotFoundException('Usuário não encontrado');
    }

    if (!user.isActive) {
      this.logger.warn(`Usuário inativo: ${userId}`, 'GetUserProfileUseCase');
      throw new UnauthorizedException('Usuário inativo');
    }

    this.logger.log(`Perfil encontrado para usuário: ${userId}`, 'GetUserProfileUseCase');

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      updatedAt: user.updatedAt,
    };
  }
} 