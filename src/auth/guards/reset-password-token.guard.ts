import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ResetPasswordJwtAuthGuard extends AuthGuard('jwt-reset-password-token') {
  handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
    if (info.name === 'TokenExpiredError') {
      err = new UnauthorizedException('Link has expired, you need to get new one!')
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
