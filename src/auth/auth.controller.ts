import { Controller, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { User as UserEntity } from 'src/user/user.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@User() user: UserEntity) {
    return user;
  }
}
