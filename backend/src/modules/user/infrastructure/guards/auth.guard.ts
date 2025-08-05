import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CustomLoggerService } from '../../../../shared/services/logger.service';

// Extend Request interface to include user property
interface RequestWithUser extends Request {
  user?: any;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly logger: CustomLoggerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.warn('Token não fornecido', 'AuthGuard');
      throw new UnauthorizedException('Token não fornecido');
    }

    // Token de teste especial para desenvolvimento (nunca expira)
    if (token === 'test-token-pedro-almeida') {
      this.logger.log('Usando token de teste para Pedro Almeida', 'AuthGuard');
      request.user = {
        sub: 'd893cff7-caee-4d4a-a008-9001fb471ab1',
        email: 'pedro.hp.almeida@gmail.com',
        name: 'Pedro Almeida',
      };
      return true;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload;
      this.logger.log(`Usuário autenticado: ${payload.sub}`, 'AuthGuard');
      return true;
    } catch (error) {
      this.logger.warn(`Token inválido: ${error.message}`, 'AuthGuard');
      throw new UnauthorizedException('Token inválido');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
} 