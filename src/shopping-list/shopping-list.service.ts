import { Injectable, HttpStatus } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseError, Exceptions, ResponseMessage } from 'src/common/constants';
import { NotFoundEntity } from 'src/common/exceptions/not-found-entity.exception';
import { STATUS } from 'src/shopping-list/enums/status.enum';
import { User } from 'src/user/user.entity';
import { Not, Repository } from 'typeorm';
import { RemoveListProductDto } from './dto/remove-list-product.dto';
import { ShoppingListProductDto } from './dto/shopping-list-product.dto';
import { ShoppingListProduct } from './shopping-list-product.entity';
import { ShoppingList } from './shopping-list.entity';
import { ChangeStatusDto } from './dto/change-status.dto';
import { UpdateShoppingListProductQuantityDto } from './dto/update-shopping-list-product.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { getPaginationFindOptions } from 'src/common/utilities';
import { ShoppingListUser } from './shopping-list-user.entity';
import { SHARED_LIST_USER_ROLE } from './enums/shared-list-user-role.enum';
import { ShareShoppingListDto } from './dto/share-shopping-list.dto';

@Injectable()
export class ShoppingListService {
  constructor(
    @InjectRepository(ShoppingList)
    private readonly shoppingListRepository: Repository<ShoppingList>,

    @InjectRepository(ShoppingListProduct)
    private readonly shoppingListProductRepository: Repository<ShoppingListProduct>,

    @InjectRepository(ShoppingListUser)
    private readonly shoppingListUserRepository: Repository<ShoppingListUser>,
  ) {}

  public async updateProductQuantity(
    { id, quantity }: UpdateShoppingListProductQuantityDto,
    user: User,
  ) {
    const activeList = await this.getActiveList(user);
    const { affected } = await this.shoppingListProductRepository.update(
      { id, shoppingList: activeList },
      { quantity },
    );

    if (!affected) {
      throw new NotFoundEntity(
        Exceptions.NOT_FOUND_ENTITY(
          `shoppingListProductId=${id} AND shoppingListId=${activeList.id}`,
        ),
      );
    }

    activeList.updatedAt = new Date();
    activeList.products = activeList.products.map((product) => {
      if (product.id === id) {
        return { ...product, quantity };
      }

      return product;
    });

    return {
      message: ResponseMessage.ProductQuantityUpdated,
      data: activeList,
      status: 200,
    };
  }

  public async getActiveList(user: User, throwIfNotFound = false) {
    const activeList = await this.shoppingListRepository.findOne({
      where: { status: STATUS.ACTIVE, user },
      relations: ['products', 'products.product', 'authorizedUsers.user'],
    });

    if (activeList) {
      return activeList;
    }

    if (throwIfNotFound) {
      throw new NotFoundEntity(Exceptions.NOT_FOUND_ENTITY(`userId=${user.id} AND status=active`));
    }

    const authorizedUsers = await this.shoppingListUserRepository.save([
      { user, role: SHARED_LIST_USER_ROLE.OWNER },
    ]);
    return await this.shoppingListRepository.save({
      status: STATUS.ACTIVE,
      products: [],
      user,
      authorizedUsers,
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
      data: await this.getActiveList(user),
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

  async changeStatus(user: User, { id, status }: ChangeStatusDto) {
    const { affected } = await this.shoppingListRepository.update(
      { id, user },
      {
        status,
        updatedAt: new Date(),
      },
    );

    if (!affected) {
      throw new NotFoundEntity(
        Exceptions.NOT_FOUND_ENTITY(`userId=${user.id} AND shoppingListId=${id}`),
      );
    }

    const data = await this.getList(user, id);

    return {
      message: ResponseMessage.StatusChanged,
      data: data!,
      status: HttpStatus.OK,
    };
  }

  async saveList(user: User, name: string) {
    const shoppingList = await this.getActiveList(user, true);
    const newData = {
      name,
      updatedAt: new Date(),
    };

    await this.shoppingListRepository.update({ user, status: STATUS.ACTIVE }, newData);

    return {
      message: ResponseMessage.ListSaved,
      data: { ...shoppingList, ...newData },
      status: HttpStatus.OK,
    };
  }

  public groupListsByMonthAndYear(lists: ShoppingList[]) {
    const listsGroupedByDate = lists.reduce((result, list) => {
      const month = list.createdAt.toLocaleDateString('en-US', { month: 'long' });
      const year = list.createdAt.getFullYear();
      const key = `${month},${year}`;

      if (!result[key]) {
        result[key] = [];
      }

      result[key].push(list);

      return result;
    }, {} as Record<string, Array<ShoppingList>>);

    return Object.entries(listsGroupedByDate).map(([date, lists]) => {
      const [month, year] = date.split(',');

      return [[month, +year], lists];
    });
  }

  public async getAll(user: User, { take = 50, page = 1 }: PaginationQueryDto) {
    const [lists, total] = await this.shoppingListRepository.findAndCount({
      where: { user, status: Not(STATUS.ACTIVE) },
      ...getPaginationFindOptions(take, page),
    });

    return {
      message: ResponseMessage.AllLists,
      data: this.groupListsByMonthAndYear(lists),
      status: HttpStatus.OK,
      pagination: {
        total,
        take,
        page,
      },
    };
  }

  public async get(id: number, { take = 50, page = 1 }: PaginationQueryDto, user: User) {
    const shoppingList = await this.shoppingListRepository.findOne({
      where: [
        { id, user },
        { id, authorizedUsers: { user: { id: user.id } } },
      ],
      relations: {
        authorizedUsers: {
          user: true,
        },
      },
      relationLoadStrategy: 'query',
    });

    if (!shoppingList) {
      throw new NotFoundEntity(
        Exceptions.NOT_FOUND_ENTITY(`userId=${user.id} AND shoppingListId=${id}`),
      );
    }

    const [products, total] = await this.shoppingListProductRepository.findAndCount({
      where: { shoppingList: { id: shoppingList.id } },
      relations: ['product'],
      ...getPaginationFindOptions(take, page),
    });

    shoppingList.products = products;

    return {
      message: ResponseMessage.ListFound,
      data: shoppingList,
      pagination: {
        total,
        page,
        take,
      },
      status: HttpStatus.OK,
    };
  }

  private removeOwnerFromUserList(body: ShareShoppingListDto, owner: User) {
    return body.users.filter((user) => {
      return user.role !== SHARED_LIST_USER_ROLE.OWNER && user.email !== owner.email;
    });
  }

  private getNewUsers(body: ShareShoppingListDto, authorizedUsers: ShoppingListUser[]) {
    return body.users
      .filter((newUser) => {
        return !authorizedUsers.find(({ user }) => user.email === newUser.email);
      })
      .map((newUser) => ({ user: { email: newUser.email }, role: newUser.role }));
  }

  private getOldUsers(body: ShareShoppingListDto, authorizedUsers: ShoppingListUser[]) {
    return authorizedUsers.map((oldUser) => {
      const { user: authorizedUser } = oldUser;
      const { role = oldUser.role } =
        body.users.find((user) => authorizedUser.email === user.email) || {};

      return {
        ...oldUser,
        role,
      };
    });
  }

  public async share(body: ShareShoppingListDto, shoppingList: ShoppingList) {
    const { authorizedUsers, user: owner } = shoppingList;

    body.users = this.removeOwnerFromUserList(body, owner);

    const newUsers = this.getNewUsers(body, authorizedUsers);
    const oldUsers = this.getOldUsers(body, authorizedUsers);

    const users = await this.shoppingListUserRepository.save([...oldUsers, ...newUsers]);

    shoppingList.isShared = body.isShared;
    shoppingList.authorizedUsers = users;

    const updatedShoppingList = await this.shoppingListRepository.save(shoppingList);

    return {
      status: HttpStatus.OK,
      data: updatedShoppingList,
      message: ResponseMessage.ListShared,
    };
  }
}
