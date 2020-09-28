import { Controller, Get, Param, Query, Res, Req} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConceptMap } from '../interfaces/concept-map';
import { FhirTerminologyService } from './fhir-terminology.service';
import { Request, Response } from "express";

@Controller('fhir')
@ApiTags('FHIR')
export class FhirTerminologyController {
    
    constructor(private readonly fhirTerminologyService: FhirTerminologyService) {}

    @Get(':sourceId')
    @ApiResponse({
        status: 200,
        description: 'Provides a list of fhir resource Concept Maps for a given SourceId',
        type: null
      })
    async getSource(@Param('sourceId') sourceId: string, @Query('pageNumber') pageNumber = 1, @Req() req: Request, @Res() res: Response){

        const allTerms = await this.fhirTerminologyService.getAllTerms(sourceId, pageNumber);
        res.header("currentPage", allTerms.currentPage.toString());
        res.header("totalNumberOfConcepts", allTerms.totalNumberOfConcepts.toString());
        res.header("totalNumberOfPages", allTerms.totalNumberOfPages.toString());
       
        return res.send(allTerms.resources);
    }

    @Get(':sourceId/:conceptId')
    @ApiResponse({
        status: 200,
        description: 'Returns a specifics concept map fhir resource',
        type: null
      })
    getSourceConcepts(@Param('sourceId') sourceId: string, @Param('conceptId') conceptId: string):Promise<ConceptMap>{
        return this.fhirTerminologyService.getTerm(sourceId, conceptId);
    }

}
 