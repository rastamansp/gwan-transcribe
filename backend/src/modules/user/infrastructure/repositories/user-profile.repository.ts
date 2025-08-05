import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserProfileRepository } from '../../domain/repositories/user-profile.repository.interface';
import { User } from '../../../auth/domain/entities/user.entity';
import { CustomLoggerService } from '../../../../shared/services/logger.service';

@Injectable()
export class UserProfileRepository implements IUserProfileRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logger: CustomLoggerService,
  ) {}

  async findById(id: string): Promise<User | null> {
    this.logger.log(`Buscando usuário por ID: ${id}`, 'UserProfileRepository');
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    this.logger.log(`Atualizando usuário: ${id}`, 'UserProfileRepository');
    await this.userRepository.update(id, data);
    const updatedUser = await this.findById(id);
    if (!updatedUser) {
      throw new Error(`Usuário não encontrado após atualização: ${id}`);
    }
    return updatedUser;
  }

  async deactivate(id: string): Promise<User> {
    this.logger.log(`Desativando usuário: ${id}`, 'UserProfileRepository');
    await this.userRepository.update(id, { 
      isActive: false,
      updatedAt: new Date(),
    });
    const deactivatedUser = await this.findById(id);
    if (!deactivatedUser) {
      throw new Error(`Usuário não encontrado após desativação: ${id}`);
    }
    return deactivatedUser;
  }

  async activate(id: string): Promise<User> {
    this.logger.log(`Ativando usuário: ${id}`, 'UserProfileRepository');
    await this.userRepository.update(id, { 
      isActive: true,
      updatedAt: new Date(),
    });
    const activatedUser = await this.findById(id);
    if (!activatedUser) {
      throw new Error(`Usuário não encontrado após ativação: ${id}`);
    }
    return activatedUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    this.logger.log(`Buscando usuário por email: ${email}`, 'UserProfileRepository');
    return this.userRepository.findOne({ where: { email } });
  }

  async getStatistics(id: string): Promise<any> {
    this.logger.log(`Buscando estatísticas do usuário: ${id}`, 'UserProfileRepository');
    
    // Por enquanto retorna dados básicos
    // Quando implementar módulo de transcrição, buscar dados reais
    const user = await this.findById(id);
    if (!user) return null;

    return {
      totalTranscriptions: 0, // Será implementado com módulo de transcrição
      totalMinutes: 0,
      averageAccuracy: 0,
      lastTranscription: null,
      preferredLanguage: null,
      accountCreatedAt: user.createdAt,
      daysSinceLastUse: Math.floor((Date.now() - user.lastLoginAt.getTime()) / (1000 * 60 * 60 * 24)),
    };
  }
} 