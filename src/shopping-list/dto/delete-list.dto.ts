import { IsInt } from 'class-validator';

export class DeleteListDto {
  @IsInt()
  id: number;
}
