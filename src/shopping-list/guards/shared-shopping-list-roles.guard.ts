import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { ShoppingList } from 'src/shopping-list/shopping-list.entity';
import { User } from 'src/user/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { NotFoundEntity } from 'src/common/exceptions/not-found-entity.exception';
import { Exceptions } from 'src/common/constants';

@Injectable()
export class SharedShoppingListRolesGuard extends JwtAuthGuard {
  constructor(
    @InjectRepository(ShoppingList)
    private readonly shoppingListRepository: Repository<ShoppingList>,
    protected readonly reflector: Reflector,
  ) {
    super(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    const { body, params } = request;
    const roles = this.reflector.get('roles', context.getHandler());
    const shoppingListId = body.id || params.id;

    if (!shoppingListId) {
      return true;
    }

    if (!user) {
      return false;
    }

    const shoppingList = await this.shoppingListRepository.findOne({
      where: { id: Equal(shoppingListId) },
      relations: {
        user: true,
        authorizedUsers: {
          user: true,
        },
      },
    });

    if (!shoppingList) {
      throw new NotFoundEntity(Exceptions.NOT_FOUND_ENTITY(`shoppingListId=${shoppingListId}`));
    }

    request.shoppingList = shoppingList;

    const { authorizedUsers, user: owner } = shoppingList;

    if (user.email === owner.email) {
      return true;
    }

    if (!shoppingList.isShared) {
      return false;
    }

    if (authorizedUsers.length === 1) {
      return true;
    }

    const authorizedUser = shoppingList.authorizedUsers.find(
      ({ user: { email } }) => email === user.email,
    );

    return roles.includes(authorizedUser?.role);
  }
}
