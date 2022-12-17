import { Category } from 'src/categories/category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
}
