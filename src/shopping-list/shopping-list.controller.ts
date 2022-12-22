import { Body, Controller, Patch, Post, UseGuards, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { AddShoppingListProductDto } from './dto/add-shopping-list-product.dto';
import { ShoppingListService } from './shopping-list.service';
import { User as UserEntity } from 'src/user/user.entity';
import { ShoppingListProductDto } from './dto/shopping-list-product.dto';
import { RemoveListProductDto } from './dto/remove-list-product.dto';

@Controller('shopping-list')
export class ShoppingListController {
  constructor(private readonly shoppingListService: ShoppingListService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async addProduct(@Body() { products }: AddShoppingListProductDto, @User() user: UserEntity) {
    return this.shoppingListService.addProduct(user, products);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  removeProductFromList(
    @Body() removeListProductData: RemoveListProductDto,
    @User() user: UserEntity,
  ) {
    return this.shoppingListService.removeProductFromList(removeListProductData, user);
  }
}
