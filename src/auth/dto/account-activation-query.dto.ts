import { IsUrl } from 'class-validator';

export class AccountActivationQueryDto {
  @IsUrl({ require_protocol: true, host_whitelist: ['localhost'] })
  redirect: string;
}
