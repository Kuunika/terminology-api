import { Controller, Get, Param } from '@nestjs/common';
import { SearchService } from './search.service';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,

  } from '@nestjs/swagger';
import { Search } from 'src/interfaces/lib/search.interface';

@Controller('search')
@ApiTags('Search')
export class SearchController {

    constructor(private readonly searchService: SearchService) {}

    @Get(':searchTerm')
    @ApiResponse({
        status: 200,
        description: 'Takes a string search term and returns a Promise Search Object',
        type: Search
      })
    getSearchTerm(@Param('searchTerm') searchTerm: string):Promise<Search>{
        return this.searchService.searchAll(searchTerm);
    }
    
}