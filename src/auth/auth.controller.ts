import { Body, Controller, Post, UseGuards, HttpCode, Req, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/common/decorators/user.decorator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User as UserEntity } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ResponseDto } from 'src/common/dto/response.dto';
import { RefreshJwtAuthGuard } from 'src/auth/guards/refresh-jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(
    @User() user: UserEntity,
    @Req() request: Request,
  ): Promise<ResponseDto<UserEntity>> {
    return await this.authService.login(user, request);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  public async register(@Body() userRegistrationData: CreateUserDto) {
    return this.authService.createUser(userRegistrationData);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  public refresh(
    @User() user: UserEntity,
    @Req() request: Request,
  ): Promise<ResponseDto<UserEntity>> {
    return this.authService.login(user, request);
  }
}
