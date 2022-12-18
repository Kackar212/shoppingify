import { Product } from 'src/products/product.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ShoppingList {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column()
  status: string;

  @ManyToMany(() => Product, { cascade: true })
  @JoinTable()
  products: Product[];

  @ManyToOne(() => User, (user) => user.shoppingLists, { cascade: true })
  user: User;
}
