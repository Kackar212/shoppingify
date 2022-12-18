import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingList } from './shopping-list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingList])],
})
export class ShoppingListModule {}
