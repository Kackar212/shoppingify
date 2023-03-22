import { Body, Controller, Patch, Post, UseGuards, Delete, Get, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { AddShoppingListProductDto } from './dto/add-shopping-list-product.dto';
import { ShoppingListService } from './shopping-list.service';
import { User as UserEntity } from 'src/user/user.entity';
import { RemoveListProductDto } from './dto/remove-list-product.dto';
import { ShoppingList } from './shopping-list.entity';
import { ResponseDto } from 'src/common/dto/response.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { SaveListDto } from 'src/shopping-list/dto/save-list.dto';
import { ResponseMessage } from 'src/common/constants';
import { UpdateShoppingListProductQuantityDto } from './dto/update-shopping-list-product.dto';

@Controller('shopping-list')
export class ShoppingListController {
  constructor(private readonly shoppingListService: ShoppingListService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async addProduct(
    @Body() { products }: AddShoppingListProductDto,
    @User() user: UserEntity,
  ): Promise<ResponseDto<ShoppingList>> {
    return this.shoppingListService.addProduct(user, products);
  }

  @Get('/active')
  @UseGuards(JwtAuthGuard)
  async getActiveList(@User() user: UserEntity): Promise<ResponseDto<ShoppingList>> {
    const activeList = await this.shoppingListService.getActiveList(user);

    return {
      message: ResponseMessage.ActiveList,
      data: activeList,
      status: 200,
    };
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  removeProductFromList(
    @Body() removeListProductData: RemoveListProductDto,
    @User() user: UserEntity,
  ): Promise<ResponseDto<ShoppingList>> {
    return this.shoppingListService.removeProductFromList(removeListProductData, user);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  updateShoppingListProductQuantity(
    @Body() newData: UpdateShoppingListProductQuantityDto,
    @User() user: UserEntity,
  ): Promise<ResponseDto<ShoppingList>> {
    return this.shoppingListService.updateProductQuantity(newData, user);
  }

  @Patch('status')
  @UseGuards(JwtAuthGuard)
  changeStatus(
    @User() user: UserEntity,
    @Body() changeStatusBody: ChangeStatusDto,
  ): Promise<ResponseDto<ShoppingList>> {
    return this.shoppingListService.changeStatus(user, changeStatusBody);
  }

  @Patch('save')
  @UseGuards(JwtAuthGuard)
  save(
    @User() user: UserEntity,
    @Body() { name }: SaveListDto,
  ): Promise<ResponseDto<ShoppingList>> {
    return this.shoppingListService.saveList(user, name);
  }
}
