import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsInt()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  take?: number = 50;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  constructor(data: PaginationQueryDto) {
    Object.assign(this, data);
  }
}
