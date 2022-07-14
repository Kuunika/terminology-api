import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CategoryFromOCL } from '../interfaces/category-from-ocl.interface';
import { Category } from '../interfaces/lib/category.interface';
import { OclService } from '../ocl/ocl.service';
import { createCategoriesDescriptionsArray } from './categories-helper/categories.helper';

@Injectable()
export class CategoriesService {
  constructor(private readonly oclService: OclService) {}

  async getAllCategories(): Promise<Category[]> {
    return this.buildCategoriesTreeFromBreadcrumb(
      await this.oclService.requestAllCategoriesFromOcl(),
    );
  }

  buildCategoriesTreeFromBreadcrumb(
    categoriesFromOcl: CategoryFromOCL[],
  ): Category[] {
    const categories: Category[] = [];
    const breadcrumbs = this.buildBreadcrumbObject(categoriesFromOcl);

    breadcrumbs.forEach((breadcrumb) =>
      this.buildCategoriesTree(
        categories,
        breadcrumb.breadcrumb.split('/'),
        breadcrumb.id,
        //createCategoriesDescriptionsArray(breadcrumb.descriptions),
        breadcrumb.icons,
      ),
    );

    return categories;
  }

  buildBreadcrumbObject(categoriesFromOcl: CategoryFromOCL[]) {
    return categoriesFromOcl.map((concept) => {
      return {
        breadcrumb: concept.extras.Category,
        id: concept.id,
        descriptions: concept.extras.Descriptions,
        icons: (() => concept.extras.Icon.split(','))(),
      };
    });
  }

  /* 
    TODO: When adding the description and Icons copy the same thing that was done with the bread crumb where a reducing list is continually passed down.
  */

  buildCategoriesTree(
    categories: Category[],
    breadcrumbArray: string[],
    id: string,
    icons: string[],
    descriptions?: any,
  ) {
    // Base Case - Checks to see if bread crumb array is complete
    if (breadcrumbArray.length === 0) {
      return categories;
    }
    // removes element from breadcrumb array
    const currentBreadcrumbPath = breadcrumbArray.shift();

    // gets description for category
    //const description = descriptions.find(descriptionsArray => currentBreadcrumbPath in descriptionsArray);

    // checks to see if the current depth of the array has an element with the same name as the bread crumb element
    const existingElementIndex = categories.findIndex(
      (category) => category.categoryTitle === currentBreadcrumbPath,
    );
    // if element does not exist then creates a new category object.
    if (existingElementIndex === -1) {
      categories.push({
        categoryTitle: currentBreadcrumbPath,
        id: breadcrumbArray.length === 0 ? id : null,
        categories: breadcrumbArray.length === 0 ? null : [],
        icons,
        description: 'null',
        //description: (() => description[currentBreadcrumbPath])()
      });

      // recursive function call made with new category object,
      this.buildCategoriesTree(
        categories[categories.length - 1].categories,
        breadcrumbArray,
        id,
        [],
        'null',
      );
    } else {
      // otherwise makes recursive function call made with existing category object
      this.buildCategoriesTree(
        categories[existingElementIndex].categories,
        breadcrumbArray,
        id,
        [],
        'null',
      );
    }
  }
}