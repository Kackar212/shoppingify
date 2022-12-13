import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { HttpCode, Response, UseInterceptors } from '@nestjs/common/decorators';
import { ClassSerializerInterceptor } from '@nestjs/common/serializer';
import { Request, Response as HttpResponse } from 'express';
import { User } from 'src/common/decorators/user.decorator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User as UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
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

  @HttpCode(201)
  @Post('register')
  public async register(@Body() registerData: CreateUserDto) {
    return this.authService.createUser(registerData);
  }
}
