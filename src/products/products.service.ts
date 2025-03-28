import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { DatabaseError, Exceptions, ResponseMessage } from 'src/common/constants';
import { NotFoundEntity } from 'src/common/exceptions/not-found-entity.exception';
import { ILike, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { User } from 'src/user/user.entity';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(user: User, productData: CreateProductDto) {
    const product = this.productRepository.create({ user, ...productData });

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

  async get(id: number, user: User) {
    const product = await this.productRepository.findOneBy({ id, user });

    if (!product) {
      throw new NotFoundEntity(Exceptions.NOT_FOUND_ENTITY(`id=${id}`));
    }

    return {
      message: ResponseMessage.ProductFound,
      data: product,
      status: HttpStatus.OK,
    };
  }

  async getAllGroupedByCategory({ take = 50, page = 1 }: PaginationQueryDto, user: User) {
    let [categories, total] = await this.categoriesService.getCategoriesWithProductsAndCount(
      take,
      page,
      user,
    );

    const transformedCategories = await Promise.all(
      categories.map(async (category) => {
        const products = await this.productRepository.find({
          where: { category, user },
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

  async search(name: string, { take = 50, page = 1 }: PaginationQueryDto, user: User) {
    const [products, total] = await this.productRepository.findAndCount({
      where: { name: name ? ILike(`%${name}%`) : undefined, user },
      select: ['name', 'id'],
      take,
      skip: (page - 1) * take,
    });

    return {
      message: ResponseMessage.SearchedProducts,
      data: products,
      status: HttpStatus.OK,
      pagination: {
        total,
        page,
        take,
      },
    };
  }

  public async removeProduct(id: number, user: User) {
    const product = this.productRepository.findOne({ where: { id, user } });
    const { affected } = await this.productRepository.delete({
      id,
      user,
    });

    if (!affected) {
      throw new BadRequestException(
        Exceptions.NOT_FOUND_ENTITY(`productId=${id} AND userId=${user.id}`),
      );
    }

    return {
      message: ResponseMessage.ProductRemovedFromList,
      data: await product,
      status: HttpStatus.OK,
    };
  }

  public async getByCategory(id: number, { take = 50, page = 1 }: PaginationQueryDto, user: User) {
    const category = await this.categoriesService.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundEntity(Exceptions.NOT_FOUND_ENTITY(`categoryId=${id}`));
    }

    const [products, total] = await this.productRepository.findAndCount({
      where: { category, user },
      take,
      skip: (page - 1) * take,
      select: ['name', 'id'],
    });

    return {
      message: ResponseMessage.SearchedProducts,
      data: { category, products },
      status: HttpStatus.OK,
      pagination: {
        total,
        page,
        take,
      },
    };
  }
}
