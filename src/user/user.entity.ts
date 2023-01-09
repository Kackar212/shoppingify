import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ShoppingList } from 'src/shopping-list/shopping-list.entity';

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

  @Column({ default: false })
  @Exclude()
  isPasswordReseted: boolean;

  @OneToMany(() => ShoppingList, (shoppingList) => shoppingList.user)
  shoppingLists: ShoppingList[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
