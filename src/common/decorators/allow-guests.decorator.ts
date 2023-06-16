import { SetMetadata } from '@nestjs/common';

export function AllowGuests() {
  return SetMetadata('allow-guests', true);
}
