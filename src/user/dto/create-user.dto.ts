import { IsString } from 'class-validator';
import { IsEmail, IsAlphanumeric, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 20)
  @IsAlphanumeric()
  @Matches(/^[A-Z].*/i)
  name: string;

  @IsEmail()
  @Length(3, 100)
  email: string;

  @IsString()
  @Length(8, 30)
  password: string;
}
