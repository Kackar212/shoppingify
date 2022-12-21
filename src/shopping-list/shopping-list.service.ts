import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { STATUS } from 'src/shopping-list/enums/status.enum';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { ShoppingList } from './shopping-list.entity';

@Injectable()
export class ShoppingListService {
  constructor(
    @InjectRepository(ShoppingList)
    private readonly shoppingListRepository: Repository<ShoppingList>,
  ) {}

  public async getActiveList(user: User) {
    const activeList = await this.shoppingListRepository.findOne({
      where: { status: STATUS.ACTIVE, user },
      relations: ['products', 'products.product'],
    });

    if (activeList) {
      return activeList;
    }

    return await this.shoppingListRepository.save({
      status: STATUS.ACTIVE,
      products: [],
      user,
    });
  }
}
