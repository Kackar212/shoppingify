import { IsUrl } from 'class-validator';

export class AccountActivationQueryDto {
  @IsUrl({ require_protocol: true })
  redirect: string;
}
