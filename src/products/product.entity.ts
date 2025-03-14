import { Category } from 'src/categories/category.entity';
import { ShoppingListProduct } from 'src/shopping-list/shopping-list-product.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  note: string;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => Category, (category) => category.products, {
    eager: true,
    cascade: true,
  })
  category: Category;

  @OneToMany(() => ShoppingListProduct, (shoppingListProduct) => shoppingListProduct.product)
  listItems: ShoppingListProduct[];

  @ManyToOne(() => User, (user) => user.products)
  user: User;
}
