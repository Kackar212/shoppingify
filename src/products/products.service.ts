import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { DatabaseError, Exceptions } from 'src/common/constants';
import { NotFoundEntity } from 'src/common/exceptions/not-found-entity.exception';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly categoriesService: CategoriesService,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(productData: CreateProductDto) {
    const product = this.productRepository.create(productData);

    try {
      await this.productRepository.save(product);
    } catch (e) {
      switch (e.errno) {
        case DatabaseError.ERR_NO_DEFAULT_FOR_FIELD: {
          const {
            category: { id },
          } = product;

          throw new NotFoundEntity(Exceptions.NOT_FOUND_ENTITY(`id=${id}`));
        }
      }
    }

    return product;
  }
}
