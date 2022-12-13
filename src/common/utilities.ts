import { HttpStatus } from '@nestjs/common';
import { ExceptionCode } from 'src/common/constants';

export function getErrorCode(status: number) {
  switch (status) {
    case HttpStatus.BAD_REQUEST: {
      return ExceptionCode.BAD_REQUEST;
    }

    case HttpStatus.UNAUTHORIZED: {
      return ExceptionCode.UNAUTHORIZED;
    }

    case HttpStatus.FORBIDDEN: {
      return ExceptionCode.FORBIDDEN;
    }

    case HttpStatus.NOT_FOUND: {
      return ExceptionCode.NOT_FOUND;
    }
  }
}
