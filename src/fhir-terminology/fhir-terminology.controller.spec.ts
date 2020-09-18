import { Test, TestingModule } from '@nestjs/testing';
import { FhirTerminologyController } from './fhir-terminology.controller';

describe('FhirTerminologyController', () => {
  let controller: FhirTerminologyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FhirTerminologyController],
    }).compile();

    controller = module.get<FhirTerminologyController>(FhirTerminologyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
