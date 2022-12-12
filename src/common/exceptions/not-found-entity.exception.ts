import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundEntity extends HttpException {
  constructor(entity: string, where: string) {
    super(`${entity} with ${where} does not exist`, HttpStatus.NOT_FOUND);
  }
}
