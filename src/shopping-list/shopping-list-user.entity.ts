import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SHARED_LIST_USER_ROLE } from './enums/shared-list-user-role.enum';
import { User } from 'src/user/user.entity';
import { ShoppingList } from './shopping-list.entity';

@Entity()
export class ShoppingListUser {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    default: SHARED_LIST_USER_ROLE.VIEWER,
  })
  role: SHARED_LIST_USER_ROLE;

  @ManyToOne(() => User)
  user: User;
}
