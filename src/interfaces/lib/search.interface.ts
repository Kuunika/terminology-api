import { ApiProperty } from '@nestjs/swagger';
import { SearchResult } from './search-result.interface';

export class Search {
    @ApiProperty({ example: 'Polio', description: 'The Search Term Provided' })
    searchTerm: string;
    
    @ApiProperty({ example: [{
        numberOfResults: 40,
        sourceId: 'MTK-0090',
        categoryBreadcrumb: 'clinical',
    }], description: 'List of all source id that have concept/terms that match the given searchterm provided'})
    searchResults: SearchResult[];
}