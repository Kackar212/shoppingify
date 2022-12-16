import { IsNumber, IsString, IsUrl, Length } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Length(3, 50)
  name: string;

  @IsNumber()
  category: number;

  @IsString()
  @Length(0, 255)
  note: string;

  @IsUrl()
  image: string;
}
