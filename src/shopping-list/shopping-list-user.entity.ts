import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SHARED_LIST_USER_ROLE } from './enums/shared-list-user-role.enum';
import { User } from 'src/user/user.entity';

@Entity()
export class ShoppingListUser {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    default: SHARED_LIST_USER_ROLE.VIEWER,
  })
  role: SHARED_LIST_USER_ROLE;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'user_email',
    referencedColumnName: 'email',
    foreignKeyConstraintName: 'fk_user_email',
  })
  user: User;
}
