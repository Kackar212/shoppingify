import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingListProduct } from './shopping-list-product.entity';
import { ShoppingListUser } from './shopping-list-user.entity';
import { ShoppingListController } from './shopping-list.controller';
import { ShoppingList } from './shopping-list.entity';
import { ShoppingListService } from './shopping-list.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingListUser, ShoppingList, ShoppingListProduct])],
  providers: [ShoppingListService],
  controllers: [ShoppingListController],
})
export class ShoppingListModule {}
