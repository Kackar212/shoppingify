import { IsUrl } from 'class-validator';

export class RedirectDto {
  @IsUrl()
  redirect: string;
}
