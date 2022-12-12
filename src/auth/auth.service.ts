import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist';
import { User } from 'src/user/user.entity';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordEqual = await bcrypt.compare(password, user.password);

    if (isPasswordEqual) {
      return user;
    }

    return null;
  }

  public createAccessToken(user: User) {
    const payload = { name: user.name };

    return this.jwtService.signAsync(payload);
  }

  public createRefreshToken({ name }: User) {
    return this.jwtService.signAsync(
      { name },
      {
        secret: this.configService.get('REFRESH_JWT_SECRET'),
        expiresIn: this.configService.get('REFRESH_JWT_EXPIRATION_TIME'),
      },
    );
  }

  private createTokenCookie(
    name: string,
    value: string,
    options: CookieOptions,
  ) {
    const tokenCookieOptions = {
      ...options,
      httpOnly: true,
      secure: true,
      path: '/',
    };

    const optionsReducer = (
      result: string,
      [option, optionValue]: [string, unknown],
    ) => {
      if (option && optionValue) {
        result += `${option}=${optionValue};`;
      }

      if (option && !optionValue) {
        result += `${option};`;
      }

      return result;
    };

    const optionsAsString = Object.entries(tokenCookieOptions).reduce(
      optionsReducer,
      '',
    );

    return `${name}=${value}; ${optionsAsString}`;
  }
}
