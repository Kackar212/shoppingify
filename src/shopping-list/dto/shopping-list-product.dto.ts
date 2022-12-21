import { Type } from 'class-transformer';
import { IsNotEmptyObject, IsNumber, ValidateNested } from 'class-validator';

class Product {
  @IsNumber()
  id: number;
}

export class ShoppingListProductDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => Product)
  product: Product;
}
