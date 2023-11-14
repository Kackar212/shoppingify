import { IsEmail } from 'class-validator';
import { RedirectDto } from 'src/common/dto/redirect.dto';

export class ResendActivationMailDto extends RedirectDto {
  @IsEmail()
  email: string;
}
