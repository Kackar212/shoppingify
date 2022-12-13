import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist';
import { User } from 'src/user/user.entity';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Request, Response } from 'express';
import { DatabaseError, ExceptionCode, Exceptions, ResponseMessage } from 'src/common/constants';

@Injectable()
export class AuthService {
  private readonly AccessTokenName = 'AccessToken';
  private readonly RefreshTokenName = 'RefreshToken';

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getUser(email: string, password: string) {
    try {
      const user = await this.userService.findByEmail(email);

      const isPasswordEqual = await bcrypt.compare(password, user.password);

      if (!isPasswordEqual) {
        throw new BadRequestException(Exceptions.WRONG_CREDENTIALS);
      }

      return user;
    } catch (e) {
      const { code } = e.getResponse();

      switch (code) {
        case ExceptionCode.WRONG_CREDENTIALS: {
          throw e;
        }

        case ExceptionCode.NOT_FOUND_ENTITY: {
          throw new BadRequestException(Exceptions.WRONG_CREDENTIALS);
        }

        default: {
          throw new BadRequestException(Exceptions.BAD_REQUEST);
        }
      }
    }
  }

  public createAccessToken(user: User) {
    const payload = { name: user.name };

    return this.jwtService.signAsync(payload);
  }

  public createRefreshToken({ name }: User) {
    const { expirationTime, secret } = this.configService.get('refreshToken');

    return this.jwtService.signAsync(
      { name },
      {
        secret,
        expiresIn: expirationTime,
      },
    );
  }

  private createTokenCookie(name: string, value: string, maxAge: number) {
    const tokenCookieOptions = {
      'max-age': maxAge,
      httpOnly: true,
      secure: true,
      path: '/',
    };

    const optionsReducer = (result: string, [option, optionValue]: [string, unknown]) => {
      if (option && optionValue) {
        result += `${option}=${optionValue};`;
      }

      if (option && !optionValue) {
        result += `${option};`;
      }

      return result;
    };

    const optionsAsString = Object.entries(tokenCookieOptions).reduce(optionsReducer, '');

    return `${name}=${value}; ${optionsAsString}`;
  }

  public createAccessTokenCookie(token: string) {
    const { expirationTime } = this.configService.get('accessToken');

    return this.createTokenCookie(this.AccessTokenName, token, expirationTime);
  }

  public createRefreshTokenCookie(token: string) {
    const { expirationTime } = this.configService.get('refreshToken');

    return this.createTokenCookie(this.RefreshTokenName, token, expirationTime);
  }

  public async createUser(userData: CreateUserDto) {
    const user = this.userService.create(userData);

    try {
      user.password = await bcrypt.hash(userData.password, 10);

      return await this.userService.save(user);
    } catch (e) {
      switch (e.errno) {
        case DatabaseError.ERR_DUPLICATE_ENTRY: {
          throw new BadRequestException(Exceptions.USER_ALREADY_EXISTS);
        }

        default: {
          throw new BadRequestException(Exceptions.BAD_REQUEST);
        }
      }
    }
  }

  public async login(user: User, request: Request) {
    const response = request.res as Response;

    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);
    const accessTokenCookie = this.createAccessTokenCookie(accessToken);
    const refreshTokenCookie = this.createRefreshTokenCookie(refreshToken);

    await this.userService.setRefreshToken(user.name, refreshToken);

    response.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    return {
      message: ResponseMessage.UserLoggedIn,
      data: user,
      status: HttpStatus.OK,
    };
  }
}
