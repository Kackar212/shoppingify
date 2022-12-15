import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

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

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
