import { IsIn, IsInt } from 'class-validator';
import { STATUS } from '../enums/status.enum';

export class ChangeStatusDto {
  @IsInt()
  id: number;

  @IsIn(Object.values(STATUS))
  status: string;
}
