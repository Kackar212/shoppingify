import { IsNumber, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsNumber()
  @Min(1)
  @Max(50)
  take?: number = 50;

  @IsNumber()
  @Min(1)
  page?: number = 1;

  constructor(data: PaginationQueryDto) {
    Object.assign(this, data);
  }
}
