import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ResponseDto } from 'src/common/dto/response.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';
import { ProductsService } from './products.service';
import { PaginationInterceptor } from 'src/common/interceptors/pagination.interceptor';
import { Query, UseGuards, UseInterceptors } from '@nestjs/common/decorators';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ResponseWithPaginationDto } from 'src/common/dto/response-with-pagination.dto';
import { Category } from 'src/categories/category.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { User as UserEntity } from 'src/user/user.entity';

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

  @Get(':id(\\d+)')
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

  @Get('/search/:name?')
  @UseInterceptors(PaginationInterceptor)
  search(
    @Param('name') name: string,
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<ResponseDto<Product[]>> {
    return this.productsService.search(name, paginationQuery);
  }
}
