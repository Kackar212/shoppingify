import { IsEmail } from 'class-validator';

export class NewPasswordDto {
  @IsEmail()
  email: string;
}
