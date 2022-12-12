import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public findByName(name: string) {
    return this.userRepository.findOne({ where: { name } });
  }

  public findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  public update(name: string, userData: QueryDeepPartialEntity<User>) {
    return this.userRepository.update({ name }, userData);
  }

  public create(user: User) {
    return this.userRepository.save(user);
  }
}
