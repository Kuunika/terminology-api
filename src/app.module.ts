import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { FhirTerminologyModule } from './fhir-terminology/fhir-terminology.module';
import { OclService } from './ocl/ocl.service';
import { SearchModule } from './search/search.module';
import { SourcesModule } from './sources/sources.module';


@Module({
  imports: [
    CategoriesModule,
    FhirTerminologyModule,
    ConfigModule.forRoot({ isGlobal: true }),
    SearchModule,
    SourcesModule,
  ],
  controllers: [AppController],
  providers: [AppService, OclService],
})
export class AppModule {}
