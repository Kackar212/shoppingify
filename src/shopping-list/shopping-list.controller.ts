import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { AddShoppingListProductDto } from './dto/add-shopping-list-product.dto';
import { ShoppingListService } from './shopping-list.service';
import { User as UserEntity } from 'src/user/user.entity';

@Controller('shopping-list')
export class ShoppingListController {
  constructor(private readonly shoppingListService: ShoppingListService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async addProduct(@Body() { products }: AddShoppingListProductDto, @User() user: UserEntity) {
    return this.shoppingListService.addProduct(user, products);
  }
}
