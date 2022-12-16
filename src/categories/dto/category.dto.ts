import { IsNumber, IsOptional, IsString, Length, ValidateIf } from 'class-validator';

export class CategoryDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @Length(3, 80)
  @ValidateIf((o: CategoryDto) => !o.id)
  name?: string;
}
