import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Search } from "../interfaces/lib/search.interface";
import { SearchResult } from "../interfaces/lib/search-result.interface";
import * as Fuse from 'fuse.js';
import { OclService } from '../ocl/ocl.service';
import { CategoryFromOCL } from "../interfaces/category-from-ocl.interface";
import { ConceptFromOCL } from "../interfaces/concept-from-ocl.interface";
import { AxiosError } from 'axios';
import { Extras } from 'src/ocl-interfaces/all-categories.interface';

@Injectable()
export class SearchService {


  constructor(private readonly oclService: OclService) {}

  async searchAll(searchTerm: string): Promise<Search> {

    try {
      const searchResults: SearchResult[] = await this.queryAllSources(searchTerm);

      if(searchResults.length === 0) throw new HttpException({
        error: 'No Results Found',
        status: 404
      },HttpStatus.NOT_FOUND);

      return {
        searchTerm,
        searchResults
      };
    } catch (error) {
      console.log(error);
      throw new HttpException({

      },HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async queryAllSources(searchTerm: string): Promise<SearchResult[]> {
    try {
      const listOfAllSources = await this.oclService.requestAllCategoriesFromOcl();

      const searchResult:SearchResult[] = [];

      for (const source of listOfAllSources) {
        searchResult.push(await this.querySource(source, searchTerm));
      }

      return searchResult;

    } catch (error) {

      const err = error as AxiosError;
      console.log(err.message);
    }
  }

  async querySource(source: CategoryFromOCL, searchTerm: string): Promise<SearchResult>{
    try {
      const concepts = await this.oclService.requestAllConceptsFromCategory(source.extras.Route, 1, 10, searchTerm);
      console.log(concepts.totalNumberOfConcepts);
      return {
        categoryBreadcrumb: source.extras.Category,
        numberOfResults: concepts.totalNumberOfConcepts,
        sourceId: source.id,
      }
    } catch (error) {
      console.log(error);
    }
      
  }


  private async buildSearchResultsList(categoriesFromOCL: CategoryFromOCL[], searchTerm: string) {
    const searchResults: SearchResult[] = [];
    for (const category of categoriesFromOCL) {
      console.log(category.extras.Route);
      const conceptsFromCategory: ConceptFromOCL[] = null; //await RedisSingleton.convertHvalsToArrayOfObjects<ConceptFromOCL>(category.extras.Route);
      const searchResult = this.buildSearchResult(conceptsFromCategory, category, searchTerm);
      if(searchResult.numberOfResults > 0) searchResults.push(searchResult);
    }
    return searchResults;
  }

  buildSearchResult(
    conceptFromOCL: ConceptFromOCL[],
    categoryFromOCL: CategoryFromOCL,
    searchTerm: string
  ): SearchResult {
    const searchSearchResult: SearchResult = {
      numberOfResults: 0,
      sourceId: categoryFromOCL.id,
      categoryBreadcrumb: categoryFromOCL.extras.Category
    };

    const headings = categoryFromOCL.extras.Details.split(',').map(heading => heading.trim());

    const listOfTermsToSearch = this.buildSearchableLists(
      conceptFromOCL,
      headings
    );

    searchSearchResult.numberOfResults = this.searchConcepts(
      listOfTermsToSearch,
      headings,
      searchTerm
    ).length;

    return searchSearchResult;
  }

  searchConcepts(
    listOfTermsToSearch: any[],
    keys: string[],
    searchTerm: string
  ) {
    const options = {
      shouldSort: true,
      threshold: 0.3,
      location: 0,
      distance: 40,
      maxPatternLength: 40,
      minMatchCharLength: 20,
      keys
    };
    const fuse = new Fuse(listOfTermsToSearch, options);
    return fuse.search(searchTerm);
  }

  buildSearchableLists(conceptsFromOCL: ConceptFromOCL[], headings: string[]): any[] {
    return conceptsFromOCL.map(concept =>
      this.buildSearchableList(concept, headings)
    );
  }

  buildSearchableList(sourceObject: ConceptFromOCL, headings: string[]) {
    const termDescription = {};
    for (const heading of headings) {
      if (heading.toLowerCase().includes('name')||heading.toLowerCase().includes('term')) {
        termDescription[heading] = sourceObject.names.find(
          name => name.name_type === heading
        ).name;
      }

      if (heading.toLowerCase().includes('description')) {
        termDescription[heading] = sourceObject.descriptions.find(
          description => description.description_type === heading
        ).description;
      }

      if (
        sourceObject.hasOwnProperty(heading) &&
        typeof sourceObject[heading] !== 'object'
      ) {
        termDescription[heading] = sourceObject[heading];
      } else if (sourceObject.extras.hasOwnProperty(heading)) {
        termDescription[heading] = sourceObject.extras[heading];
      }
    }
    return termDescription;
  }
}