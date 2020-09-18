import { Injectable } from '@nestjs/common';
import { OclService } from '../ocl/ocl.service';
import { ConceptFromOCL } from '../interfaces/concept-from-ocl.interface';
import { ConceptMap } from '../interfaces/concept-map';

@Injectable()
export class FhirTerminologyService {
    
    constructor(private readonly oclService: OclService) {}

    async getAllTerms(sourceId: string, pageNumber?: number){

        const categoryFromOCL =  await this.oclService.requestCategoryFromOcl(sourceId);
        console.log(categoryFromOCL);
        const allConcepts = await this.oclService.requestAllConceptsFromCategory(categoryFromOCL.extras.Route, pageNumber);
        return {
            currentPage: allConcepts.currentPage,
            totalNumberOfConcepts: allConcepts.totalNumberOfConcepts,
            totalNumberOfPages:allConcepts.totalNumberOfPages,
            resources: allConcepts.data.map(concept => this.convertConceptToFhirConceptMap(concept)),
        }
    }

    async getTerm(sourceId: string, conceptId: string){
        const categoryFromOCL =  await this.oclService.requestCategoryFromOcl(sourceId);
        return this.convertConceptToFhirConceptMap(await this.oclService.requestConceptFromOcl(categoryFromOCL.extras.Route,conceptId));
    }

    private convertConceptToFhirConceptMap(concept: ConceptFromOCL): ConceptMap{
        return {
            "resourceType": "ConceptMap",
            "id": concept.id,
            "text": null,
            "url": concept.owner_url,
            "identifier": {
                system: "Malawi Diseases",
                value: `${concept.id}`
            },
            "version": "1",
            "name": concept.names[0].name,
            "title": `FHIR/R4 ${concept.names[0].name}`,
            "status": "draft",
            "experimental": true,
            "date": `${concept.updated_on}`,
            "publisher": "Kuunika/QMD",
            "contact":null,
            "description": concept.descriptions[0].description,
            "useContext":null,
            "jurisdiction": null,
            "purpose": "To help implementers map from Malawi Diseases to ICD10 equivalent",
            "copyright": "Malawi QMD/Kuunika",
            "sourceUri": `${concept.source_url}`,
            "targetUri": `${concept.source_url}`,
            "group": [
                {
                    source:   `${concept.extras["ICD10 Code"]}`,
                    target:   `${concept.id}`,
                    element:  null,
                    unmapped: null,
                }
            ]
          }
    }

}