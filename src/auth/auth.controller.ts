import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpCode,
  Req,
  HttpStatus,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { User } from 'src/common/decorators/user.decorator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User as UserEntity } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ResponseDto } from 'src/common/dto/response.dto';
import { RefreshJwtAuthGuard } from 'src/auth/guards/refresh-jwt-auth.guard';
import { ActivationJwtAuthGuard } from './guards/activation-token.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { NewPasswordDto } from './dto/new-password.dto';
import { AccountActivationQueryDto } from './dto/account-activation-query.dto';
import { ResendActivationMailDto } from './dto/resend-activation-mail.dto';

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
  public async register(
    @Body() userRegistrationData: CreateUserDto,
  ): Promise<ResponseDto<UserEntity>> {
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

  @HttpCode(HttpStatus.OK)
  @UseGuards(ActivationJwtAuthGuard)
  @Get('activate-account/:token')
  public async activateAccount(
    @User() user: UserEntity,
    @Query() { redirect }: AccountActivationQueryDto,
    @Res() response: Response,
  ) {
    await this.authService.activateUser(user);

    response.redirect(redirect);
  }

  @HttpCode(HttpStatus.OK)
  @Post('resend-activation-mail')
  public async resendActivationMail(
    @Body() { redirect, email }: ResendActivationMailDto,
  ): Promise<ResponseDto<{}>> {
    return this.authService.resendActivationMail(email, redirect);
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  public resetPassword(@Body() { email }: NewPasswordDto): Promise<ResponseDto<{}>> {
    return this.authService.sendNewPassword(email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  public logout(@User() user: UserEntity, @Req() request: Request) {
    return this.authService.logout(user, request);
  }
}
