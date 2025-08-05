import { 
  Controller, 
  Get, 
  Put, 
  Delete, 
  Body, 
  UseGuards,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { 
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { GetUserProfileUseCase } from '../../application/use-cases/get-user-profile.use-case';
import { UpdateUserProfileUseCase } from '../../application/use-cases/update-user-profile.use-case';
import { DeactivateUserUseCase } from '../../application/use-cases/deactivate-user.use-case';
import { ActivateUserUseCase } from '../../application/use-cases/activate-user.use-case';
import { GetUserStatisticsUseCase } from '../../application/use-cases/get-user-statistics.use-case';
import { UpdateUserProfileDto } from '../../application/dto/update-user-profile.dto';
import { UserProfileResponseDto } from '../../application/dto/user-profile-response.dto';
import { UserStatisticsResponseDto } from '../../application/dto/user-statistics-response.dto';
import { AuthGuard } from '../guards/auth.guard';
import { UserGuard } from '../guards/user.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { CustomLoggerService } from '../../../../shared/services/logger.service';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
    private readonly deactivateUserUseCase: DeactivateUserUseCase,
    private readonly activateUserUseCase: ActivateUserUseCase,
    private readonly getUserStatisticsUseCase: GetUserStatisticsUseCase,
    private readonly logger: CustomLoggerService,
  ) {}

  @Get('profile')
  @UseGuards(UserGuard)
  @ApiOperation({
    summary: 'Obter perfil do usuário',
    description: 'Retorna os dados do perfil do usuário autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil obtido com sucesso',
    type: UserProfileResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token inválido ou usuário inativo',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async getProfile(@CurrentUser() user: any): Promise<UserProfileResponseDto> {
    this.logger.log(`Solicitação de perfil para usuário: ${user.sub}`, 'UserController');
    return this.getUserProfileUseCase.execute(user.sub);
  }

  @Put('profile')
  @UseGuards(UserGuard)
  @ApiOperation({
    summary: 'Atualizar perfil do usuário',
    description: 'Atualiza os dados do perfil do usuário autenticado',
  })
  @ApiBody({
    type: UpdateUserProfileDto,
    description: 'Dados para atualização do perfil',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil atualizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Perfil atualizado com sucesso' },
        user: { $ref: '#/components/schemas/UserProfileResponseDto' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou email já em uso',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token inválido ou usuário inativo',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateData: UpdateUserProfileDto,
  ) {
    this.logger.log(`Atualização de perfil solicitada para usuário: ${user.sub}`, 'UserController');
    const updatedProfile = await this.updateUserProfileUseCase.execute(user.sub, updateData);
    
    return {
      success: true,
      message: 'Perfil atualizado com sucesso',
      user: updatedProfile,
    };
  }

  @Delete('profile')
  @UseGuards(UserGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Desativar conta do usuário',
    description: 'Desativa a conta do usuário autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Conta desativada com sucesso',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Conta desativada com sucesso' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token inválido ou usuário inativo',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async deactivateProfile(@CurrentUser() user: any) {
    this.logger.log(`Desativação de conta solicitada para usuário: ${user.sub}`, 'UserController');
    return this.deactivateUserUseCase.execute(user.sub);
  }

  @Post('activate')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard) // Apenas AuthGuard, sem UserGuard
  @ApiOperation({
    summary: 'Ativar conta do usuário',
    description: 'Ativa a conta do usuário autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Conta ativada com sucesso',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Conta ativada com sucesso' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token inválido',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async activateProfile(@CurrentUser() user: any) {
    this.logger.log(`Ativação de conta solicitada para usuário: ${user.sub}`, 'UserController');
    return this.activateUserUseCase.execute(user.sub);
  }

  @Get('statistics')
  @UseGuards(UserGuard)
  @ApiOperation({
    summary: 'Obter estatísticas do usuário',
    description: 'Retorna estatísticas de uso do usuário autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas obtidas com sucesso',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statistics: { $ref: '#/components/schemas/UserStatisticsResponseDto' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token inválido ou usuário inativo',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async getStatistics(@CurrentUser() user: any) {
    this.logger.log(`Solicitação de estatísticas para usuário: ${user.sub}`, 'UserController');
    const statistics = await this.getUserStatisticsUseCase.execute(user.sub);
    
    return {
      success: true,
      statistics,
    };
  }
} 