import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ResponseDto } from 'src/common/dto/response.dto';
import { Category } from './category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('/search/:name?')
  public search(@Param('name') name: string): Promise<ResponseDto<Category[]>> {
    return this.categoriesService.searchCategories(name);
  }
}
