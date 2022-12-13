import { getErrorCode } from 'src/common/utilities';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException, NotFoundException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let result: Record<string, unknown> = { message: exceptionResponse };

    const isPlainObject = (value: unknown): value is Record<string, unknown> =>
      value?.constructor === Object;

    if (isPlainObject(exceptionResponse)) {
      result = exceptionResponse;
    }

    const code = getErrorCode(status);
    console.log('hmm');
    response.status(status).json({ statusCode: status, code, ...result });
  }
}
