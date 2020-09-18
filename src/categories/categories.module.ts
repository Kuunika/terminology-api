import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { OclService } from '../ocl/ocl.service';

@Module({
  providers: [CategoriesService, OclService],
  controllers: [CategoriesController]
})
export class CategoriesModule {}
