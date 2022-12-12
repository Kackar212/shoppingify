import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { NotFoundEntity } from 'src/common/exceptions/not-found-entity.exception';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async findByName(name: string) {
    const user = await this.userRepository.findOne({ where: { name } });

    if (!user) {
      throw new NotFoundEntity('User', `name=${name}`);
    }

    return user;
  }

  public async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundEntity('User', `email=${email}`);
    }

    return user;
  }

  public update(name: string, userData: QueryDeepPartialEntity<User>) {
    return this.userRepository.update({ name }, userData);
  }

  public create(user: DeepPartial<User>) {
    return this.userRepository.create(user);
  }

  public save(user: User) {
    return this.userRepository.save(user);
  }

  public async setRefreshToken(name: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    return this.update(name, { refreshToken: hashedRefreshToken });
  }

  public async getUserIfRefreshTokenMatches(name: string, refreshToken: string) {
    const user = await this.findByName(name);

    if (!user.refreshToken) {
      return null;
    }

    const isRefreshTokenEqual = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isRefreshTokenEqual) {
      return null;
    }

    return user;
  }
}
