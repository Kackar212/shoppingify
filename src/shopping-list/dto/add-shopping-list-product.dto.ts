import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { ShoppingListProductDto } from './shopping-list-product.dto';
import { IsEachObject } from 'src/common/decorators/is-each-object.decorator';

export class AddShoppingListProductDto {
  @ValidateNested({ each: true })
  @IsEachObject()
  @Type(() => ShoppingListProductDto)
  @IsArray()
  products: ShoppingListProductDto[];
}
