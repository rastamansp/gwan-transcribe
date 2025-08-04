import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { RequestOTPDto } from '../../application/dto/request-otp.dto';
import { VerifyOTPDto } from '../../application/dto/verify-otp.dto';
import { AuthResponseDto } from '../../application/dto/auth-response.dto';
import { RequestOTPUseCase } from '../../application/use-cases/request-otp.use-case';
import { VerifyOTPUseCase } from '../../application/use-cases/verify-otp.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly requestOTPUseCase: RequestOTPUseCase,
    private readonly verifyOTPUseCase: VerifyOTPUseCase,
  ) {}

  @Post('request-otp')
  @HttpCode(HttpStatus.OK)
  async requestOTP(@Body() dto: RequestOTPDto): Promise<AuthResponseDto> {
    return this.requestOTPUseCase.execute(dto);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOTP(@Body() dto: VerifyOTPDto): Promise<AuthResponseDto> {
    return this.verifyOTPUseCase.execute(dto);
  }
}