import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist';
import { User } from 'src/user/user.entity';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    const isPasswordEqual = await bcrypt.compare(password, user.password);

    if (!isPasswordEqual) {
      throw new HttpException('Wrong credentials', HttpStatus.BAD_REQUEST);
    }

    return user;
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

  private createTokenCookie(name: string, value: string, maxAge: string) {
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
    return this.createTokenCookie('AccessToken', token, '60');
  }

  public createRefreshTokenCookie(token: string) {
    const expirationTime = this.configService.get('REFRESH_JWT_EXPIRATION_TIME');

    return this.createTokenCookie('RefreshToken', token, `${expirationTime / 1000}`);
  }

  public async createUser(userData: CreateUserDto) {
    const user = this.userService.create(userData);

    try {
      return await this.userService.save(user);
    } catch (e) {
      if (e.errno === 1062) {
        throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
      }
    }
  }
}
