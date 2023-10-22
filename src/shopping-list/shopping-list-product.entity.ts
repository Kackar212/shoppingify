import { Product } from 'src/products/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ShoppingList } from './shopping-list.entity';

@Entity()
@Unique(['product', 'shoppingList'])
export class ShoppingListProduct {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ default: 1 })
  quantity: number;

  @ManyToOne(() => ShoppingList, (shoppingList) => shoppingList.products, {
    onDelete: 'CASCADE',
  })
  shoppingList: ShoppingList;

  @ManyToOne(() => Product, (product) => product.listItems, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
