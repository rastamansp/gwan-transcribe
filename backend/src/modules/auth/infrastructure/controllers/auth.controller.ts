import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { 
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { RequestOTPDto } from '../../application/dto/request-otp.dto';
import { VerifyOTPDto } from '../../application/dto/verify-otp.dto';
import { AuthResponseDto } from '../../application/dto/auth-response.dto';
import { RequestOTPUseCase } from '../../application/use-cases/request-otp.use-case';
import { VerifyOTPUseCase } from '../../application/use-cases/verify-otp.use-case';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly requestOTPUseCase: RequestOTPUseCase,
    private readonly verifyOTPUseCase: VerifyOTPUseCase,
  ) {}

  @Post('request-otp')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Solicitar código OTP',
    description: 'Envia um código OTP para o email fornecido',
  })
  @ApiBody({
    type: RequestOTPDto,
    description: 'Dados para solicitação do OTP',
  })
  @ApiResponse({
    status: 201,
    description: 'Código OTP enviado com sucesso',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou email já possui OTP ativo',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  async requestOTP(@Body() dto: RequestOTPDto): Promise<AuthResponseDto> {
    return this.requestOTPUseCase.execute(dto);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verificar código OTP',
    description: 'Verifica o código OTP e retorna token JWT',
  })
  @ApiBody({
    type: VerifyOTPDto,
    description: 'Dados para verificação do OTP',
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Código inválido, expirado ou já utilizado',
  })
  @ApiResponse({
    status: 401,
    description: 'Código OTP inválido',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async verifyOTP(@Body() dto: VerifyOTPDto): Promise<AuthResponseDto> {
    return this.verifyOTPUseCase.execute(dto);
  }
}