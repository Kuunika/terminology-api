import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import * as axios from 'axios';
import { ConceptFromOCL } from '../interfaces/concept-from-ocl.interface';
import { CategoryFromOCL } from '../interfaces/category-from-ocl.interface';
import * as qs from 'qs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OclService {
  constructor(private readonly config: ConfigService) {}
  private createAxiosRequestConfigurations() {
    return {
      headers: {
        Authorization: this.config.get<string>('OCL_API_KEY'),
        'Content-Type': 'application/json',
      },
    };
  }

  async requestAllCategoriesFromOcl(): Promise<CategoryFromOCL[]> {
    const oclCategoriesUrl: string =
      this.config.get<string>('OCL_API') +
      this.config.get<string>('OCL_CATEGORIES_API_URL') +
      'concepts?verbose=true&limit=0';
    try {
      const axiosRequest = await axios.default.get<CategoryFromOCL[]>(
        oclCategoriesUrl,
        this.createAxiosRequestConfigurations(),
      );
      return axiosRequest.data;
    } catch (error) {
      console.log(error);
      console.error(error?.response?.statusText);
      this.responseStatusFromOcl(error?.response?.status);
    }
  }

  async requestCategoryFromOcl(categoryId: string): Promise<CategoryFromOCL> {
    try {
      const oclCategoriesUrl: string =
        this.config.get<string>('OCL_API') +
        this.config.get<string>('OCL_CATEGORIES_API_URL') +
        `concepts/${categoryId}?verbose=true`;
      const axiosRequest = await axios.default.get<CategoryFromOCL>(
        oclCategoriesUrl,
        this.createAxiosRequestConfigurations(),
      );
      return axiosRequest.data;
    } catch (error) {
      console.error(error.response.statusText);
      this.responseStatusFromOcl(error.response.status);
    }
  }

  async requestAllConceptsFromCategory(
    sourceUrl: string,
    pageNumber = 1,
    limit = 10,
    searchTerm?: string,
  ) {
    const queryParams = {
      verbose: true,
      page: pageNumber,
      limit,
    };

    if (searchTerm) {
      queryParams['q'] = searchTerm;
    }

    try {
      const oclConceptsUrl =
        this.config.get<string>('OCL_API') +
        sourceUrl +
        `/concepts?${qs.stringify(queryParams)}`;

      const axiosRequest = await axios.default.get<ConceptFromOCL[]>(
        oclConceptsUrl,
        this.createAxiosRequestConfigurations(),
      );
      const oclConceptsPayload = {
        data: axiosRequest.data,
        currentPage: pageNumber,
        totalNumberOfConcepts: +axiosRequest.headers.num_found,
        totalNumberOfPages: Math.ceil(+axiosRequest.headers.num_found / 10),
      };

      return oclConceptsPayload;
    } catch (error) {
      console.error(error.response.statusText);
      this.responseStatusFromOcl(error.response.status);
    }
  }

  async requestConceptFromOcl(
    sourceUrl: string,
    conceptId: string,
  ): Promise<ConceptFromOCL> {
    try {
      const oclConceptsUrl =
        this.config.get<string>('OCL_API') +
        sourceUrl +
        `/concepts/${conceptId}` +
        '?verbose=true';
      const axiosRequest = await axios.default.get<ConceptFromOCL>(
        oclConceptsUrl,
        this.createAxiosRequestConfigurations(),
      );
      return axiosRequest.data;
    } catch (error) {
      console.error(error.response.statusText);
      this.responseStatusFromOcl(error.response.status);
    }
  }

  private responseStatusFromOcl(axiosRequest: number) {
    if (axiosRequest === 404) {
      throw new HttpException(
        {
          error: 404,
          message: 'Source/Concept Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    } else if (axiosRequest !== 200) {
      throw new HttpException(
        {
          error: 500,
          message: 'Internal Server Error, Please Try Again Later',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
