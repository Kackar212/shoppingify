import { Injectable, BadRequestException, HttpStatus, ConflictException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist';
import { User } from 'src/user/user.entity';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Request, Response } from 'express';
import { DatabaseError, ExceptionCode, Exceptions, ResponseMessage } from 'src/common/constants';
import { MailerService } from '@nestjs-modules/mailer';

const ACTIVATION_PAGE_PATH = 'auth/activate-account';

@Injectable()
export class AuthService {
  private readonly AccessTokenName = 'AccessToken';
  private readonly RefreshTokenName = 'RefreshToken';

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
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

  public createActivationToken(name: string) {
    const { expirationTime, secret } = this.configService.get('activationToken');

    return this.jwtService.signAsync({ name }, { secret, expiresIn: expirationTime });
  }

  private createTokenCookie(name: string, value: string, maxAge: number) {
    const IS_DEV_MODE = process.env.NODE_ENV === 'development';

    const tokenCookieOptions = {
      'max-age': maxAge,
      httpOnly: true,
      secure: !IS_DEV_MODE,
      sameSite: IS_DEV_MODE ? 'None' : 'Lax',
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

  public createActivationURL(token: string, redirect: string) {
    const url = new URL(`${ACTIVATION_PAGE_PATH}/${token}`, this.configService.get('app.url'));
    url.searchParams.append('redirect', redirect);

    return url.toString();
  }

  public async sendActivationMail(user: User, activationToken: string, redirect: string) {
    const activationPageURL = this.createActivationURL(activationToken, redirect);

    return this.mailerService.sendMail({
      to: user.email,
      subject: 'Account activation',
      template: 'account-activation',
      context: {
        activationPageURL,
      },
    });
  }

  public async createUser(userData: CreateUserDto) {
    const user = this.userService.create(userData);
    const { redirect } = userData;

    try {
      const activationToken = await this.createActivationToken(user.name);
      const hashRounds = 10;

      user.password = await bcrypt.hash(user.password, hashRounds);
      user.activationToken = activationToken;

      const savedUser = await this.userService.save(user);

      this.sendActivationMail(savedUser, activationToken, redirect);

      return {
        message: ResponseMessage.UserCreated,
        data: savedUser,
        status: HttpStatus.CREATED,
      };
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

  public async activateUser(user: User) {
    return await this.userService.update(user.name, { isActive: true, activationToken: '' });
  }

  public async isActivationTokenInvalid(token: string) {
    try {
      await this.jwtService.verifyAsync<User>(token, {
        secret: this.configService.get('activationToken.secret'),
      });

      return false;
    } catch {
      return true;
    }
  }

  public async resendActivationMail(user: User, redirect: string) {
    if (user.isActive) {
      throw new ConflictException(Exceptions.ACCOUNT_ALREADY_ACTIVATED);
    }

    const isUserActivationTokenInvalid = await this.isActivationTokenInvalid(user.activationToken!);

    if (!isUserActivationTokenInvalid) {
      throw new ConflictException(Exceptions.TOKEN_STILL_VALID);
    }

    const activationToken = await this.createActivationToken(user.name);

    await this.userService.update(user.name, { ...user, activationToken });
    this.sendActivationMail(user, activationToken, redirect);

    return {
      message: ResponseMessage.ActivationMailResent,
      data: {},
      status: HttpStatus.OK,
    };
  }

  private sendNewPasswordMail(email: string, newPassword: string) {
    this.mailerService.sendMail({
      to: email,
      subject: 'New password request',
      template: 'new-password',
      context: {
        newPassword,
      },
    });
  }

  public async sendNewPassword(email: string) {
    const user = await this.userService.findByEmail(email);

    if (user.isPasswordReseted) {
      throw new ConflictException(Exceptions.PASSWORD_ALREADY_RESETED);
    }

    const { randomBytes } = await import('node:crypto');

    const newPassword = randomBytes(24).toString('base64');

    const hashRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, hashRounds);

    await this.userService.update(user.name, {
      ...user,
      password: hashedNewPassword,
      isPasswordReseted: true,
    });

    this.sendNewPasswordMail(user.email, newPassword);

    return {
      message: ResponseMessage.NewPassword,
      data: {},
      status: HttpStatus.OK,
    };
  }
}
