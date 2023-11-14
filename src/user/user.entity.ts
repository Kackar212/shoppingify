import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ShoppingList } from 'src/shopping-list/shopping-list.entity';
import { Product } from 'src/products/product.entity';
import { ShoppingListUser } from 'src/shopping-list/shopping-list-user.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  @Exclude()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  @Exclude()
  refreshToken?: string;

  @Column({ default: false })
  @Exclude()
  isActive?: boolean;

  @Column({ nullable: true })
  @Exclude()
  activationToken?: string;

  @Column({ nullable: true, type: 'timestamp' })
  @Exclude()
  passwordResetedAt?: Date;

  @OneToMany(() => ShoppingList, (shoppingList) => shoppingList.user)
  shoppingLists: ShoppingList[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToMany(() => ShoppingListUser, (user) => user.user)
  @JoinColumn([
    {
      referencedColumnName: 'userName',
    },
    { referencedColumnName: 'userEmail' },
  ])
  shoppingListUsers: ShoppingListUser[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
