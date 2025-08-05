import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestOTPDto } from '../dto/request-otp.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { OTPRepository } from '../../infrastructure/repositories/otp.repository';
import { EmailService } from '../../infrastructure/services/email.service';
import { CustomLoggerService } from '../../../../shared/services/logger.service';

@Injectable()
export class RequestOTPUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpRepository: OTPRepository,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly logger: CustomLoggerService,
  ) {}

  async execute(dto: RequestOTPDto): Promise<AuthResponseDto> {
    this.logger.log(`Solicitação de OTP iniciada para ${dto.email}`, 'RequestOTPUseCase');
    
    // Verificar se o usuário está bloqueado
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser?.lockedUntil && existingUser.lockedUntil > new Date()) {
      this.logger.warn(`Tentativa de login bloqueada para ${dto.email}`, 'RequestOTPUseCase');
      throw new BadRequestException('Conta temporariamente bloqueada. Tente novamente mais tarde.');
    }

    // Gerar código OTP
    const otpCode = this.generateOTPCode();
    this.logger.log(`Código OTP gerado: ${otpCode}`, 'RequestOTPUseCase');
    const expiresInMinutes = this.configService.get<number>('otp.expiresIn', 30);
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    // Criar ou atualizar usuário
    let user = existingUser;
    if (!user) {
      this.logger.log(`Criando novo usuário: ${dto.email}`, 'RequestOTPUseCase');
      user = await this.userRepository.create({
        email: dto.email,
        name: dto.name,
        isActive: false,
      });
    } else {
      this.logger.log(`Atualizando usuário existente: ${dto.email}`, 'RequestOTPUseCase');
      user = await this.userRepository.update(user.id, {
        name: dto.name,
      });
    }

    // Criar OTP
    await this.otpRepository.create({
      email: dto.email,
      code: otpCode,
      expiresAt,
    });
    this.logger.log(`OTP criado no banco para ${dto.email}`, 'RequestOTPUseCase');

    // Enviar email
    try {
      await this.emailService.sendOTPEmail(dto.email, otpCode, dto.name);
      this.logger.log(`Email enviado com sucesso para ${dto.email}`, 'RequestOTPUseCase');
    } catch (error) {
      this.logger.error(`Erro ao enviar email para ${dto.email}: ${error.message}`, error.stack, 'RequestOTPUseCase');
      throw error;
    }

    this.logger.log(`Solicitação de OTP concluída com sucesso para ${dto.email}`, 'RequestOTPUseCase');
    return {
      success: true,
      message: `Código de verificação enviado para ${dto.email}`,
    };
  }

  private generateOTPCode(): string {
    // Em desenvolvimento, usar código fixo para facilitar testes
    if (process.env.NODE_ENV === 'development') {
      return '123456';
    }
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
} 