import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { HttpCode, Req } from '@nestjs/common/decorators';
import { Request } from 'express';
import { User } from 'src/common/decorators/user.decorator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User as UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ResponseDto } from 'src/common/dto/response.dto';
import { RefreshJwtAuthGuard } from 'src/auth/guards/refresh-jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(
    @User() user: UserEntity,
    @Req() request: Request,
  ): Promise<ResponseDto<UserEntity>> {
    return await this.authService.login(user, request);
  }

  @HttpCode(201)
  @Post('register')
  public async register(@Body() registerData: CreateUserDto) {
    return this.authService.createUser(registerData);
  }

  @HttpCode(200)
  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  public refresh(
    @User() user: UserEntity,
    @Req() request: Request,
  ): Promise<ResponseDto<UserEntity>> {
    return this.authService.login(user, request);
  }
}
