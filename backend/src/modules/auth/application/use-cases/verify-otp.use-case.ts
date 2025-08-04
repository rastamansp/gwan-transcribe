import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { VerifyOTPDto } from '../dto/verify-otp.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { OTPRepository } from '../../infrastructure/repositories/otp.repository';
import { CustomLoggerService } from '../../../../shared/services/logger.service';

@Injectable()
export class VerifyOTPUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpRepository: OTPRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: CustomLoggerService,
  ) {}

  async execute(dto: VerifyOTPDto): Promise<AuthResponseDto> {
    this.logger.log(`Verificação de OTP iniciada para ${dto.email}`, 'VerifyOTPUseCase');
    
    // Buscar OTP válido
    const otp = await this.otpRepository.findByEmailAndCode(dto.email, dto.code);
    
    if (!otp) {
      this.logger.warn(`Código OTP inválido para ${dto.email}`, 'VerifyOTPUseCase');
      throw new UnauthorizedException('Código inválido');
    }

    if (otp.isUsed) {
      this.logger.warn(`Código OTP já utilizado para ${dto.email}`, 'VerifyOTPUseCase');
      throw new BadRequestException('Código já foi utilizado');
    }

    if (otp.expiresAt < new Date()) {
      this.logger.warn(`Código OTP expirado para ${dto.email}`, 'VerifyOTPUseCase');
      throw new BadRequestException('Código expirado');
    }

    if (otp.attempts >= this.configService.get<number>('otp.maxAttempts', 3)) {
      this.logger.warn(`Máximo de tentativas excedido para ${dto.email}`, 'VerifyOTPUseCase');
      throw new BadRequestException('Máximo de tentativas excedido');
    }

    // Buscar usuário
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      this.logger.warn(`Usuário não encontrado para ${dto.email}`, 'VerifyOTPUseCase');
      throw new BadRequestException('Usuário não encontrado');
    }

    // Verificar se usuário está bloqueado
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      this.logger.warn(`Conta bloqueada para ${dto.email}`, 'VerifyOTPUseCase');
      throw new BadRequestException('Conta temporariamente bloqueada');
    }

    // Marcar OTP como usado
    await this.otpRepository.markAsUsed(otp.id);
    this.logger.log(`OTP marcado como usado para ${dto.email}`, 'VerifyOTPUseCase');

    // Atualizar usuário
    const updateData: Partial<typeof user> = {
      isActive: true,
      lastLoginAt: new Date(),
      loginAttempts: 0,
    };
    
    await this.userRepository.update(user.id, updateData);
    this.logger.log(`Usuário atualizado para ${dto.email}`, 'VerifyOTPUseCase');

    // Gerar token JWT
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const jwtSecret = this.configService.get<string>('jwt.secret');
    if (!jwtSecret) {
      throw new Error('JWT secret não configurado');
    }

    const token = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: this.configService.get<string>('jwt.expiresIn', '30m'),
    });

    this.logger.log(`Login realizado com sucesso para ${dto.email}`, 'VerifyOTPUseCase');
    
    return {
      success: true,
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
} 