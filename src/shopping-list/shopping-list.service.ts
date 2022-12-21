import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { ShoppingListProduct } from './shopping-list-product.entity';
import { ShoppingList } from './shopping-list.entity';

@Injectable()
export class ShoppingListService {
  constructor(
    @InjectRepository(ShoppingList)
    private readonly shoppingListRepository: Repository<ShoppingList>,

    @InjectRepository(ShoppingListProduct)
    private readonly shoppingListProductRepository: Repository<ShoppingListProduct>,
  ) {}

  public async getActiveList(user: User) {
    const activeList = await this.shoppingListRepository.findOne({
      where: { status: 'active', user },
      relations: ['products', 'products.product'],
    });

    if (activeList) {
      return activeList;
    }

    return await this.shoppingListRepository.save({
      status: 'active',
      products: [],
      user,
    });
  }
}
