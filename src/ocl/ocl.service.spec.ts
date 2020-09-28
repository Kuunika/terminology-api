import { Test, TestingModule } from '@nestjs/testing';
import { OclService } from './ocl.service';
import { ConceptFromOCL } from '../ocl-interfaces/concept-from-ocl.interface';
import * as _ from 'lodash';
require('dotenv').config();

describe('OclService', () => {
  let service: OclService;
  const requiredFields = [
    'extras',
    'names',
    'descriptions',
    'id',
    'retired',
    'source',
    'source_url',
    'owner',
    'owner_type',
    'owner_url',
    'version',
    'created_on',
    'updated_on',
    'version_created_on',
    'version_created_by'
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OclService],
    }).compile();

    service = module.get<OclService>(OclService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should not be null', async () => {
    const concept = await service.requestConceptFromOcl('orgs/mw-terminology-service/sources/mw-diseases-diagnosis/', 'MDT-88678f');
    expect(concept).not.toBe(null);
  }, 60_000);

  it('should return OCL Data in correct Structure', async () => {
    const concept = await service.requestConceptFromOcl('orgs/mw-terminology-service/sources/mw-diseases-diagnosis/', 'MDT-88678f');
    const oclObjectKeys = Object.keys(concept);
    const result =  testRequiredFields(requiredFields, oclObjectKeys);

    expect(result).toBe(true);
  }, 60_000);

  it('should return a list of OCL Data in the correct Structure', async () => {
    const concepts = await service.requestAllConceptsFromCategory('orgs/mw-terminology-service/sources/mw-diseases-diagnosis/');
    const oclObjectKeys = Object.keys(concepts.data[0]);

    const result =  testRequiredFields(requiredFields, oclObjectKeys);

    expect(result).toBe(true);

  },60_000);
});


function testRequiredFields(requiredFields: string[], objectKeys: string[]){
  return requiredFields.reduce((pre, current)=> {
      if(!pre){
          return pre;
      }
      return objectKeys.includes(current);
  }, true);

}