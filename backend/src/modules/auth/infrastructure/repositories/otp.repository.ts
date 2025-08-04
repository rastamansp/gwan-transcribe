import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { OTP } from '../../domain/entities/otp.entity';
import { IOTPRepository } from '../../domain/repositories/otp.repository.interface';

@Injectable()
export class OTPRepository implements IOTPRepository {
  constructor(
    @InjectRepository(OTP)
    private readonly repository: Repository<OTP>,
  ) {}

  async create(otp: Partial<OTP>): Promise<OTP> {
    const newOTP = this.repository.create(otp);
    return this.repository.save(newOTP);
  }

  async findByEmailAndCode(email: string, code: string): Promise<OTP | null> {
    return this.repository.findOne({
      where: { email, code, isUsed: false },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsUsed(id: string): Promise<void> {
    await this.repository.update(id, { isUsed: true });
  }

  async incrementAttempts(id: string): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(OTP)
      .set({ attempts: () => 'attempts + 1' })
      .where('id = :id', { id })
      .execute();
  }

  async deleteExpired(): Promise<void> {
    await this.repository.delete({
      expiresAt: LessThan(new Date()),
    });
  }

  async findByEmail(email: string): Promise<OTP[]> {
    return this.repository.find({
      where: { email },
      order: { createdAt: 'DESC' },
    });
  }
} 