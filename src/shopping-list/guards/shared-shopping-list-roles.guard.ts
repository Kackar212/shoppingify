import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { ShoppingList } from 'src/shopping-list/shopping-list.entity';
import { User } from 'src/user/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

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
    const body = request.body;
    const roles = this.reflector.get('roles', context.getHandler());

    if (!body.id) {
      return true;
    }

    if (!user) {
      return false;
    }

    const shoppingList = await this.shoppingListRepository.findOne({
      where: { id: Equal(body.id) },
      relations: {
        user: true,
        authorizedUsers: {
          user: true,
        },
      },
    });

    if (!shoppingList) {
      return false;
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
