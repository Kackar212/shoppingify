import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ActivationTokenStrategy extends PassportStrategy(Strategy, 'jwt-activation-token') {
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
    const activationToken = request.params.token;

    const user = await this.userService.getUserIfActivationTokenMatches(
      payload.name,
      activationToken,
    );

    return user;
  }
}
