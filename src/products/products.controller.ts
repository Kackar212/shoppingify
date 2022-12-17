import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ResponseDto } from 'src/common/dto/response.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';
import { ProductsService } from './products.service';

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
}
