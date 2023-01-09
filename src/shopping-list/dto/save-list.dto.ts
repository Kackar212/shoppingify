import { IsDefined, IsInt, IsString, Length } from 'class-validator';

export class SaveListDto {
  @IsString()
  @IsDefined()
  @Length(3, 125)
  name: string;
}
