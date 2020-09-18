import { Controller, Get, Param, Query } from '@nestjs/common';
import { SourcesService } from './sources.service';
import { ConceptService } from './concept/concept.service';
import { Concept } from '../interfaces/lib/concept.interface';
import { Source } from '../interfaces/lib/source.interface';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('sources')
@ApiTags('Sources')
export class SourcesController {
    
    constructor(private readonly sourceService: SourcesService, private readonly conceptService: ConceptService) {}
    
    @Get(':sourceId')
    @ApiResponse({
        status: 200,
        description: 'Returns a source and a paginated list of all concepts associated with that source',
        type: null
      })
    getSource(@Param('sourceId') sourceId: string, @Query('filterTerm') term = '', @Query('pageNumber') pageNumber = 1): Promise<Source>{
        return this.sourceService.getSource(sourceId.toUpperCase(), pageNumber, term);
    }

    @Get(':sourceId/:conceptId')
    @ApiResponse({
        status: 200,
        description: 'Returns a specific concept from a given sourceId and conceptId',
        type: null
      })
    getSourceConcepts(@Param('sourceId') sourceId: string, @Param('conceptId') conceptId: string): Promise<Concept>{
        return this.conceptService.getConceptDescription(sourceId.toUpperCase(),conceptId);
    }
}
