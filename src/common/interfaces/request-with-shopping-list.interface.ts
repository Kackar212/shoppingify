import { Request } from 'express';
import { ShoppingList } from 'src/shopping-list/shopping-list.entity';

export interface RequestWithShoppingList extends Request {
  shoppingList: ShoppingList;
}
