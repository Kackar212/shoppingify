import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() productData: CreateProductDto) {
    return this.productsService.create(productData);
  }

  @Get(':id')
  get(@Param('id') id: number) {
    return this.productsService.get(id);
  }
}
