import { IsNumber } from 'class-validator';

export class UpdateShoppingListProductQuantityDto {
  @IsNumber()
  id: number;

  @IsNumber()
  quantity: number;
}
