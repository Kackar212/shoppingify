import { Injectable, HttpStatus } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseError, Exceptions, ResponseMessage } from 'src/common/constants';
import { NotFoundEntity } from 'src/common/exceptions/not-found-entity.exception';
import { STATUS } from 'src/shopping-list/enums/status.enum';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { RemoveListProductDto } from './dto/remove-list-product.dto';
import { ShoppingListProductDto } from './dto/shopping-list-product.dto';
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

  public async addProduct(user: User, products: ShoppingListProductDto[]) {
    const shoppingList = await this.getActiveList(user);

    const newProducts = products.filter(({ product: { id } }) => {
      const product = shoppingList.products.find(({ product }) => product.id === id);

      if (product) {
        product.quantity += 1;

        return false;
      }

      return true;
    });

    try {
      shoppingList.products.push(...this.shoppingListProductRepository.create(newProducts));
      shoppingList.updatedAt = new Date();

      await this.shoppingListRepository.save(shoppingList);
    } catch (e) {
      switch (e.errno) {
        case DatabaseError.ERR_NO_REFERENCED_ROW: {
          throw new NotFoundEntity(Exceptions.NOT_FOUND_ENTITY(`productId=${e.parameters[1]}`));
        }
      }
    }

    return {
      message: ResponseMessage.ProductAdded,
      data: shoppingList,
      status: HttpStatus.OK,
    };
  }

  public async getList(user: User, id?: number) {
    if (id) {
      return this.shoppingListRepository.findOne({
        where: { id, user },
        relations: ['products', 'products.product'],
      });
    }

    return await this.getActiveList(user);
  }

  public async removeProductFromList(
    { product, shoppingList: { id: shoppingListId } }: RemoveListProductDto,
    user: User,
  ) {
    const shoppingList = await this.getList(user, shoppingListId);

    if (!shoppingList) {
      throw new BadRequestException(
        Exceptions.NOT_FOUND_ENTITY(`shoppingListId=${shoppingListId}`),
      );
    }

    const { affected } = await this.shoppingListProductRepository.delete({
      id: product.id,
      shoppingList,
    });

    if (!affected) {
      throw new BadRequestException(
        Exceptions.NOT_FOUND_ENTITY(
          `productId=${product.id} AND shoppingListId=${shoppingList.id}`,
        ),
      );
    }

    shoppingList.products = shoppingList.products.filter((listProduct) => {
      return listProduct.id !== product.id;
    });

    return {
      message: ResponseMessage.ProductRemovedFromList,
      data: shoppingList,
      status: HttpStatus.OK,
    };
  }
}
