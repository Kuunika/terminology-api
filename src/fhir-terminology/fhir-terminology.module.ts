import { Module } from '@nestjs/common';
import { OclService } from '../ocl/ocl.service';
import { FhirTerminologyController } from './fhir-terminology.controller';
import { FhirTerminologyService } from './fhir-terminology.service';

@Module({
  controllers: [FhirTerminologyController],
  providers: [FhirTerminologyService, OclService]
})
export class FhirTerminologyModule {}
