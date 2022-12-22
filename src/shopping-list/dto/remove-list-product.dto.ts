import { Type } from 'class-transformer';
import { IsNotEmptyObject, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { ShoppingListProductDto } from './shopping-list-product.dto';

class ShoppingList {
  @IsNumber()
  id: number;
}

export class RemoveListProductDto extends ShoppingListProductDto {
  @ValidateNested()
  @Type(() => ShoppingList)
  @IsNotEmptyObject()
  @IsOptional()
  shoppingList: ShoppingList;
}
