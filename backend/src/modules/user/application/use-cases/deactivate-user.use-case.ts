import { Injectable, NotFoundException, UnauthorizedException, Inject } from '@nestjs/common';
import { IUserProfileRepository, USER_PROFILE_REPOSITORY } from '../../domain/repositories/user-profile.repository.interface';
import { CustomLoggerService } from '../../../../shared/services/logger.service';

@Injectable()
export class DeactivateUserUseCase {
  constructor(
    @Inject(USER_PROFILE_REPOSITORY)
    private readonly userRepository: IUserProfileRepository,
    private readonly logger: CustomLoggerService,
  ) {}

  async execute(userId: string): Promise<{ success: boolean; message: string }> {
    this.logger.log(`Desativando usuário: ${userId}`, 'DeactivateUserUseCase');

    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      this.logger.warn(`Usuário não encontrado: ${userId}`, 'DeactivateUserUseCase');
      throw new NotFoundException('Usuário não encontrado');
    }

    if (!user.isActive) {
      this.logger.warn(`Usuário já inativo: ${userId}`, 'DeactivateUserUseCase');
      throw new UnauthorizedException('Usuário já está inativo');
    }

    await this.userRepository.deactivate(userId);

    this.logger.log(`Usuário desativado: ${userId}`, 'DeactivateUserUseCase');

    return {
      success: true,
      message: 'Conta desativada com sucesso',
    };
  }
} 