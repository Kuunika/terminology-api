import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { OclService } from '../ocl/ocl.service';

@Module({
  providers: [SearchService, OclService],
  controllers: [SearchController]
})
export class SearchModule {}
