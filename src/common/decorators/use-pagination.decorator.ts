import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { PaginationInterceptor } from '../interceptors/pagination.interceptor';

export const Pagination = () => UseInterceptors(PaginationInterceptor);
