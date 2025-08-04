import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.repository.create(user);
    return this.repository.save(newUser);
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    await this.repository.update(id, user);
    const updatedUser = await this.findById(id);
    if (!updatedUser) {
      throw new Error('Usuário não encontrado após atualização');
    }
    return updatedUser;
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  async incrementLoginAttempts(email: string): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(User)
      .set({ loginAttempts: () => 'login_attempts + 1' })
      .where('email = :email', { email })
      .execute();
  }

  async resetLoginAttempts(email: string): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(User)
      .set({ loginAttempts: 0 })
      .where('email = :email', { email })
      .execute();
  }

  async lockUser(email: string, lockUntil: Date): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(User)
      .set({ lockedUntil: lockUntil })
      .where('email = :email', { email })
      .execute();
  }

  async unlockUser(email: string): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(User)
      .set({ lockedUntil: () => 'NULL' })
      .where('email = :email', { email })
      .execute();
  }
} 