import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingList } from './shopping-list.entity';
import { ShoppingListService } from './shopping-list.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingList])],
  providers: [ShoppingListService],
})
export class ShoppingListModule {}
