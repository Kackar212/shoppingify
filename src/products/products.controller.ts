import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ResponseDto } from 'src/common/dto/response.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';
import { ProductsService } from './products.service';
import { PaginationInterceptor } from 'src/common/interceptors/pagination.interceptor';
import { Delete, Query, UseGuards, UseInterceptors } from '@nestjs/common/decorators';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ResponseWithPaginationDto } from 'src/common/dto/response-with-pagination.dto';
import { Category } from 'src/categories/category.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { User as UserEntity } from 'src/user/user.entity';
import { ParseIntPipe } from '@nestjs/common/pipes';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() productData: CreateProductDto,
    @User() user: UserEntity,
  ): Promise<ResponseDto<Product>> {
    return this.productsService.create(user, productData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  removeProduct(@Param('id', ParseIntPipe) id: number, @User() user: UserEntity) {
    return this.productsService.removeProduct(id, user);
  }

  @Get(':id(\\d+)')
  @UseGuards(JwtAuthGuard)
  get(@Param('id') id: number, @User() user: UserEntity): Promise<ResponseDto<Product>> {
    return this.productsService.get(id, user);
  }

  @Get()
  @UseInterceptors(PaginationInterceptor)
  @UseGuards(JwtAuthGuard)
  getAll(
    @Query() paginationQuery: PaginationQueryDto,
    @User() user: UserEntity,
  ): Promise<ResponseWithPaginationDto<Category[]>> {
    return this.productsService.getAllGroupedByCategory(paginationQuery, user);
  }

  @Get('/search/:name?')
  @UseInterceptors(PaginationInterceptor)
  @UseGuards(JwtAuthGuard)
  search(
    @Param('name') name: string,
    @Query() paginationQuery: PaginationQueryDto,
    @User() user: UserEntity,
  ): Promise<ResponseDto<Product[]>> {
    return this.productsService.search(name, paginationQuery, user);
  }

  @Get('/category/:id')
  @UseInterceptors(PaginationInterceptor)
  @UseGuards(JwtAuthGuard)
  public getProductsByCategory(
    @Param('id', ParseIntPipe) id: number,
    @Query() paginationQuery: PaginationQueryDto,
    @User() user: UserEntity,
  ) {
    return this.productsService.getByCategory(id, paginationQuery, user);
  }
}
