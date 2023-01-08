import { ResponseDto } from './response.dto';

export class ResponseWithPaginationDto<Entity> extends ResponseDto<Entity> {
  pagination: {
    total: number;
    page: number;
    take: number;
  };
}
