import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShoppingListProduct } from './shopping-list-product.entity';
import { ShoppingListUser } from './shopping-list-user.entity';

@Entity()
export class ShoppingList {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  name?: string;

  @Column()
  status: string;

  @OneToMany(() => ShoppingListProduct, (shoppingListProduct) => shoppingListProduct.shoppingList, {
    cascade: true,
  })
  products: ShoppingListProduct[];

  @ManyToOne(() => User, (user) => user.shoppingLists)
  user: User;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => ShoppingListUser, (user) => user.shoppingList, { cascade: true })
  authorizedUsers: ShoppingListUser[];

  @Column({ type: 'boolean', default: false })
  isShared: boolean;
}
