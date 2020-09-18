import { ApiProperty, ApiTags } from "@nestjs/swagger";

@ApiTags('Sources')
export class Category {
    @ApiProperty({ example: "Clinical", description: 'Title of the Category' })
    categoryTitle: string;

    @ApiProperty({ example: [], description: 'A recursive list of categories representing the subcategories' })
    categories?: Category[];

    @ApiProperty({ example: '', description: 'Id for Given Category' })
    id?: string | null;

    @ApiProperty({ example: ['fab fa-accessible-icon'], description: 'A List of Font Awesome Icon' })
    icons?: string[];

    @ApiProperty({ example: "", description: 'Description for the given category' })
    description: string;
}