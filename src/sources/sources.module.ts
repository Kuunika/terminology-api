import { Module } from '@nestjs/common';
import { SourcesService } from './sources.service';
import { SourcesController } from './sources.controller';
import { ConceptService } from './concept/concept.service';
import { OclService } from '../ocl/ocl.service';
import { SearchService } from '../search/search.service';

@Module({
  providers: [SourcesService, ConceptService, OclService, SearchService],
  controllers: [SourcesController]
})
export class SourcesModule {}
