import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ResponseDto } from 'src/common/dto/response.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';
import { ProductsService } from './products.service';
import { PaginationInterceptor } from 'src/common/interceptors/pagination.interceptor';
import { Query, UseInterceptors } from '@nestjs/common/decorators';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ResponseWithPaginationDto } from 'src/common/dto/response-with-pagination.dto';
import { Category } from 'src/categories/category.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() productData: CreateProductDto): Promise<ResponseDto<Product>> {
    return this.productsService.create(productData);
  }

  @Get(':id')
  get(@Param('id') id: number): Promise<ResponseDto<Product>> {
    return this.productsService.get(id);
  }

  @Get()
  @UseInterceptors(PaginationInterceptor)
  getAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<ResponseWithPaginationDto<Category[]>> {
    return this.productsService.getAllGroupedByCategory(paginationQuery);
  }
}
