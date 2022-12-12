import { Controller, Post, UseGuards } from '@nestjs/common';
import { HttpCode, Response } from '@nestjs/common/decorators';
import { Response as HttpResponse } from 'express';
import { User } from 'src/common/decorators/user.decorator';
import { User as UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@User() user: UserEntity, @Response() response: HttpResponse) {
    const accessToken = await this.authService.createAccessToken(user);
    const refreshToken = await this.authService.createRefreshToken(user);
    const accessTokenCookie = this.authService.createAccessTokenCookie(accessToken);
    const refreshTokenCookie = this.authService.createRefreshTokenCookie(refreshToken);

    await this.userService.setRefreshToken(user.name, refreshToken);

    response.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    return response.json({
      status: 200,
    });
  }
}
