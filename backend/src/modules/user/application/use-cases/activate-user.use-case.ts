import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IUserProfileRepository, USER_PROFILE_REPOSITORY } from '../../domain/repositories/user-profile.repository.interface';
import { CustomLoggerService } from '../../../../shared/services/logger.service';

@Injectable()
export class ActivateUserUseCase {
  constructor(
    @Inject(USER_PROFILE_REPOSITORY)
    private readonly userRepository: IUserProfileRepository,
    private readonly logger: CustomLoggerService,
  ) {}

  async execute(userId: string): Promise<{ success: boolean; message: string }> {
    this.logger.log(`Ativando usuário: ${userId}`, 'ActivateUserUseCase');

    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      this.logger.warn(`Usuário não encontrado: ${userId}`, 'ActivateUserUseCase');
      throw new NotFoundException('Usuário não encontrado');
    }

    if (user.isActive) {
      this.logger.warn(`Usuário já ativo: ${userId}`, 'ActivateUserUseCase');
      return {
        success: true,
        message: 'Usuário já está ativo',
      };
    }

    await this.userRepository.activate(userId);

    this.logger.log(`Usuário ativado: ${userId}`, 'ActivateUserUseCase');

    return {
      success: true,
      message: 'Usuário ativado com sucesso',
    };
  }
} 