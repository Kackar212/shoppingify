import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { User } from 'src/user/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  handleRequest<TUser = User>(err: any, user: TUser, info: any, context: ExecutionContext) {
    if (err || !user) {
      const isGuestAllowed = this.reflector.get('allow-guests', context.getHandler());
      if (isGuestAllowed) {
        return user;
      }

      throw err || new UnauthorizedException();
    }

    return user;
  }
}
