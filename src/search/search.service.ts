import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Search } from "../interfaces/lib/search.interface";
import { SearchResult } from "../interfaces/lib/search-result.interface";
import * as Fuse from 'fuse.js';
import { OclService } from '../ocl/ocl.service';
import { CategoryFromOCL } from "../interfaces/category-from-ocl.interface";
import { ConceptFromOCL } from "../interfaces/concept-from-ocl.interface";

@Injectable()
export class SearchService {

  async searchAll(searchTerm: string): Promise<Search> {

    try {
      const categoriesFromOCL: CategoryFromOCL[] = await null; //RedisSingleton.convertHvalsToArrayOfObjects<CategoryFromOCL>('categories');
      const searchResults: SearchResult[] = await null;//this.buildSearchResultsList(categoriesFromOCL, searchTerm);

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