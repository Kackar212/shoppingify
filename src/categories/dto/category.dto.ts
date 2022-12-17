import { IsNumber, IsOptional, IsString, Length, ValidateIf } from 'class-validator';

export class CategoryDto {
  @IsNumber()
  @ValidateIf((o: CategoryDto) => !o.name || !!o.id)
  id?: number;

  @Length(3, 80)
  @ValidateIf((o: CategoryDto) => !o.id || !!o.name)
  name?: string;
}
