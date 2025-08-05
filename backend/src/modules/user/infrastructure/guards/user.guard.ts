import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { IUserProfileRepository, USER_PROFILE_REPOSITORY } from '../../domain/repositories/user-profile.repository.interface';
import { CustomLoggerService } from '../../../../shared/services/logger.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    @Inject(USER_PROFILE_REPOSITORY)
    private readonly userRepository: IUserProfileRepository,
    private readonly logger: CustomLoggerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.sub) {
      this.logger.warn('Usuário não encontrado no request', 'UserGuard');
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const userEntity = await this.userRepository.findById(user.sub);
    
    if (!userEntity) {
      this.logger.warn(`Usuário não encontrado no banco: ${user.sub}`, 'UserGuard');
      throw new UnauthorizedException('Usuário não encontrado');
    }

    if (!userEntity.isActive) {
      this.logger.warn(`Usuário inativo: ${user.sub}`, 'UserGuard');
      throw new UnauthorizedException('Usuário inativo');
    }

    // Verificar se usuário está bloqueado
    if (userEntity.lockedUntil && userEntity.lockedUntil > new Date()) {
      this.logger.warn(`Usuário bloqueado: ${user.sub}`, 'UserGuard');
      throw new UnauthorizedException('Conta temporariamente bloqueada');
    }

    this.logger.log(`Usuário autorizado: ${user.sub}`, 'UserGuard');
    return true;
  }
} 