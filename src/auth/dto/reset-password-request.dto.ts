import { IsEmail, IsUrl } from "class-validator";

export class ResetPasswordRequestDto {
  @IsEmail()
  email: string;

  @IsUrl({ require_protocol: true, require_tld: false })
  clientUrl: string;
}
