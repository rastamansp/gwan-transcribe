import { Injectable, NotFoundException, UnauthorizedException, ConflictException, Inject, BadRequestException } from '@nestjs/common';
import { IUserProfileRepository, USER_PROFILE_REPOSITORY } from '../../domain/repositories/user-profile.repository.interface';
import { UpdateUserProfileDto } from '../dto/update-user-profile.dto';
import { UserProfileResponseDto } from '../dto/user-profile-response.dto';
import { CustomLoggerService } from '../../../../shared/services/logger.service';

@Injectable()
export class UpdateUserProfileUseCase {
  constructor(
    @Inject(USER_PROFILE_REPOSITORY)
    private readonly userRepository: IUserProfileRepository,
    private readonly logger: CustomLoggerService,
  ) {}

  async execute(userId: string, updateData: UpdateUserProfileDto): Promise<UserProfileResponseDto> {
    this.logger.log(`Atualizando perfil do usuário: ${userId}`, 'UpdateUserProfileUseCase');

    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      this.logger.warn(`Usuário não encontrado: ${userId}`, 'UpdateUserProfileUseCase');
      throw new NotFoundException('Usuário não encontrado');
    }

    if (!user.isActive) {
      this.logger.warn(`Usuário inativo: ${userId}`, 'UpdateUserProfileUseCase');
      throw new UnauthorizedException('Usuário inativo');
    }

    // Verificar se email já existe (se estiver sendo atualizado)
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(updateData.email);
      if (existingUser) {
        this.logger.warn(`Email já existe: ${updateData.email}`, 'UpdateUserProfileUseCase');
        throw new ConflictException('Email já está em uso');
      }
    }

    // Filtrar valores null e undefined
    const filteredData: Partial<typeof user> = {};
    if (updateData.name !== null && updateData.name !== undefined && updateData.name !== '') {
      filteredData.name = updateData.name;
    }
    if (updateData.email !== null && updateData.email !== undefined && updateData.email !== '') {
      filteredData.email = updateData.email;
    }

    // Só atualizar se houver dados válidos
    if (Object.keys(filteredData).length === 0) {
      this.logger.warn(`Nenhum dado válido para atualização: ${userId}`, 'UpdateUserProfileUseCase');
      throw new BadRequestException('Nenhum dado válido fornecido para atualização');
    }

    // Preparar dados para atualização
    const updatePayload: Partial<typeof user> = {
      ...filteredData,
      updatedAt: new Date(),
    };

    const updatedUser = await this.userRepository.update(userId, updatePayload);

    this.logger.log(`Perfil atualizado para usuário: ${userId}`, 'UpdateUserProfileUseCase');

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      isActive: updatedUser.isActive,
      createdAt: updatedUser.createdAt,
      lastLoginAt: updatedUser.lastLoginAt,
      updatedAt: updatedUser.updatedAt,
    };
  }
} 