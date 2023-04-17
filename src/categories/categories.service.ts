import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Category } from './category.entity';
import { ResponseMessage } from 'src/common/constants';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  public async searchCategories(name: string) {
    return {
      message: ResponseMessage.SearchedCategories,
      data: await this.categoryRepository.find({ where: { name: ILike(`%${name}%`) }, take: 50 }),
      status: 200,
    };
  }

  public getCategoriesWithProductsAndCount(take: number, page: number) {
    return this.categoryRepository.findAndCount({ take, skip: (page - 1) * take });
  }
}
