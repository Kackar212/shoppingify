import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUrl, Length, ValidateNested } from 'class-validator';
import { CategoryDto } from 'src/categories/dto/category.dto';

export class CreateProductDto {
  @IsString()
  @Length(3, 50)
  name: string;

  @ValidateNested()
  @Type(() => CategoryDto)
  category: CategoryDto;

  @IsString()
  @Length(0, 255)
  @IsOptional()
  note?: string;

  @IsUrl({ host_whitelist: ['localhost'] })
  @IsOptional()
  image?: string;
}
