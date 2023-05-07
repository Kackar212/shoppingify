import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Category } from './category.entity';
import { ResponseMessage } from 'src/common/constants';
import { User } from 'src/user/user.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  public async searchCategories(name: string) {
    return {
      message: ResponseMessage.SearchedCategories,
      data: await this.categoryRepository.find({
        where: { name: name ? ILike(`%${name}%`) : undefined },
        take: 50,
      }),
      status: 200,
    };
  }

  public getCategoriesWithProductsAndCount(take: number, page: number, user: User) {
    return this.categoryRepository.findAndCount({
      where: { products: { user } },
      take,
      skip: (page - 1) * take,
    });
  }
}
