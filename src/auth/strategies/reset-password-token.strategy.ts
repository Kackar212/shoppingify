import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ResetPasswordTokenStrategy extends PassportStrategy(Strategy, 'jwt-reset-password-token') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request<{ token: string }>) => {
          return request.params.token;
        },
      ]),
      secretOrKey: configService.get('activationToken.secret'),
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request<{ token: string }, any, any, { redirect: string }>,
    payload: TokenPayload,
  ) {
    console.log(request.params);
    const activationToken = request.params.token;

    const user = await this.userService.getUserIfResetPasswordTokenMatches(
      payload.name,
      activationToken,
    );

    return user;
  }
}
