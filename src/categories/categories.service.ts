import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  public getCategoriesWithProductsAndCount(take: number, page: number) {
    return this.categoryRepository.findAndCount({ take, skip: (page - 1) * take });
  }
}
