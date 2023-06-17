import { Type } from 'class-transformer';
import { IsArray, IsInt, ValidateNested } from 'class-validator';
import { IsEachObject } from 'src/common/decorators/is-each-object.decorator';
import { SHARED_LIST_USER_ROLE } from '../enums/shared-list-user-role.enum';

class User {
  email: string;
  role: SHARED_LIST_USER_ROLE;
}

export class ShareShoppingListDto {
  @ValidateNested()
  @IsEachObject()
  @IsArray()
  @Type(() => User)
  users: User[];

  @IsInt()
  id: number;
}
