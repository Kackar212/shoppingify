import { NotFoundException, HttpStatus } from '@nestjs/common';

export class NotFoundEntity extends NotFoundException {
  constructor(errorObject: { message: string; code: string; where: string }) {
    super({ status: HttpStatus.NOT_FOUND, ...errorObject });
  }
}
