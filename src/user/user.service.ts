import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { NotFoundEntity } from 'src/common/exceptions/not-found-entity.exception';
import { Exceptions } from 'src/common/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async findByName(name: string) {
    const user = await this.userRepository.findOne({ where: { name } });

    if (!user) {
      throw new NotFoundEntity(Exceptions.NOT_FOUND_ENTITY(`name=${name}`));
    }

    return user;
  }

  public async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundEntity(Exceptions.NOT_FOUND_ENTITY(`email=${email}`));
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
    const hashRounds = 12;
    const hashedRefreshToken = await bcrypt.hash(refreshToken, hashRounds);

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

  public async getUserIfActivationTokenMatches(name: string, activationToken: string) {
    const user = await this.findByName(name);

    if (!user.activationToken) {
      return null;
    }

    const isActivationTokenEqual = activationToken === user.activationToken;

    if (!isActivationTokenEqual) {
      return null;
    }

    return user;
  }
}
