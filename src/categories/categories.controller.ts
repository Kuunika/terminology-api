import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Category } from 'src/interfaces/lib/category.interface';
import { CategoriesService } from './categories.service';

@Controller('categories')
@ApiTags('Categories')
export class CategoriesController {
    
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    @ApiResponse({
        status: 200,
        description: 'Returns a a list of all categories and subcategories provided by the Terminology Service',
        type: Category
      })
    getAllCategories():  Promise<Category[]>{
        return this.categoriesService.getAllCategories();
    }
}