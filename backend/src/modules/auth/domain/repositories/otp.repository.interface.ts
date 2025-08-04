import { OTP } from '../entities/otp.entity';

export interface IOTPRepository {
  create(otp: Partial<OTP>): Promise<OTP>;
  findByEmailAndCode(email: string, code: string): Promise<OTP | null>;
  markAsUsed(id: string): Promise<void>;
  incrementAttempts(id: string): Promise<void>;
  deleteExpired(): Promise<void>;
  findByEmail(email: string): Promise<OTP[]>;
} 