import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { DatabaseError, Exceptions, ResponseMessage } from 'src/common/constants';
import { NotFoundEntity } from 'src/common/exceptions/not-found-entity.exception';
import { ILike, Like, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoriesService: CategoriesService,
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

  async getAllGroupedByCategory({ take = 50, page = 1 }: PaginationQueryDto) {
    let [categories, total] = await this.categoriesService.getCategoriesWithProductsAndCount(
      take,
      page,
    );

    const transformedCategories = await Promise.all(
      categories.map(async (category) => {
        const products = await this.productRepository.find({
          where: { category },
          skip: (page - 1) * Math.floor(take / 2),
          take: Math.floor(take / 2),
        });

        return {
          ...category,
          products,
        };
      }),
    );

    return {
      message: ResponseMessage.AllProducts,
      data: transformedCategories,
      status: HttpStatus.OK,
      pagination: {
        total,
        page,
        take,
      },
    };
  }

  async search(name: string) {
    return {
      message: ResponseMessage.SearchedProducts,
      data: await this.productRepository.find({
        where: { name: ILike(`%${name}%`) },
        select: ['name', 'id'],
        take: 50,
        skip: 0,
      }),
      status: HttpStatus.OK,
    };
  }
}
