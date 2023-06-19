import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common/decorators';
import { SHARED_LIST_USER_ROLE } from 'src/shopping-list/enums/shared-list-user-role.enum';
import { SharedShoppingListRolesGuard } from '../guards/shared-shopping-list-roles.guard';

export function SharedShoppingListRoles(
  roles: SHARED_LIST_USER_ROLE[] = Object.values(SHARED_LIST_USER_ROLE),
) {
  return applyDecorators(SetMetadata('roles', roles), UseGuards(SharedShoppingListRolesGuard));
}
