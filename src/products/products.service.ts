import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseError, Exceptions, ResponseMessage } from 'src/common/constants';
import { NotFoundEntity } from 'src/common/exceptions/not-found-entity.exception';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
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

    return {
      message: ResponseMessage.ProductCreated,
      data: product,
      status: HttpStatus.CREATED,
    };
  }

  async get(id: number) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundEntity(Exceptions.NOT_FOUND_ENTITY(`id=${id}`));
    }

    return {
      message: ResponseMessage.ProductFound,
      data: product,
      status: HttpStatus.OK,
    };
  }
}
