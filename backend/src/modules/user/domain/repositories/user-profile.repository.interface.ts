import { User } from '../../../auth/domain/entities/user.entity';

export const USER_PROFILE_REPOSITORY = 'USER_PROFILE_REPOSITORY';

export interface IUserProfileRepository {
  findById(id: string): Promise<User | null>;
  update(id: string, data: Partial<User>): Promise<User>;
  deactivate(id: string): Promise<User>;
  activate(id: string): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  getStatistics(id: string): Promise<any>;
} 