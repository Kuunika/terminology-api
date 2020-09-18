import { Test, TestingModule } from '@nestjs/testing';
import { FhirTerminologyService } from './fhir-terminology.service';

describe('FhirTerminologyService', () => {
  let service: FhirTerminologyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FhirTerminologyService],
    }).compile();

    service = module.get<FhirTerminologyService>(FhirTerminologyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
