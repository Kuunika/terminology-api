import { ApiProperty } from "@nestjs/swagger";

export class SearchResult {
    @ApiProperty({ example: 40, description: 'Total Number of Results Found From Provided Term' })
    numberOfResults: number;

    @ApiProperty({ example: 'MTK-0090', description: 'The Source Id Containing Where List of Matching Terms Exist' })
    sourceId: string;

    @ApiProperty({ example: 'clinical', description: 'A List of Parent Categories the Source Belongs to' })
    categoryBreadcrumb: string;
}