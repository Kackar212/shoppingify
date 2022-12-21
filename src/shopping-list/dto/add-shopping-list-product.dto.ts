import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { ShoppingListProductDto } from './shopping-list-product.dto';

export class AddShoppingListProductDto {
  @ValidateNested({ each: true })
  @Type(() => ShoppingListProductDto)
  @IsArray()
  products: ShoppingListProductDto[];
}
