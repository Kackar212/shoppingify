import { IsUrl } from 'class-validator';

export class RedirectDto {
  @IsUrl({ require_protocol: true, host_whitelist: ['localhost'] })
  redirect: string;
}
