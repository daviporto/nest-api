import {
  CanActivate,
  ExecutionContext, Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '@/auth/infrastructure/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.getToken(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      request.user = await this.authService.verifyJwt(token);
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private getToken(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer') {
      return undefined;
    }

    return token;
  }
}
