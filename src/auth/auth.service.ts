import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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
}
