import { IsEmail, IsAlphanumeric, Length, Matches, IsString, IsUrl } from 'class-validator';

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

  @IsUrl()
  redirect: string;
}
