import { Type } from 'class-transformer';
import {
  IsAlphanumeric,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { IsEachObject } from 'src/common/decorators/is-each-object.decorator';
import { SHARED_LIST_USER_ROLE } from '../enums/shared-list-user-role.enum';

class User {
  @ValidateIf((user) => !user.name || user.email)
  @IsEmail()
  email: string;

  @ValidateIf((user) => !user.email || user.name)
  @IsString()
  @Length(3, 20)
  @IsAlphanumeric()
  @Matches(/^[A-Z].*/i)
  name: string;

  @IsEnum(SHARED_LIST_USER_ROLE)
  @IsOptional()
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

  @IsBoolean()
  isShared: boolean = true;
}
