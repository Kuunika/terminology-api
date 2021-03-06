import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from "dotenv";
dotenv.config();

async function bootstrap() {
  const version = process.env.TERMINOLOGY_SERVICE_API_VERSION;

  const app = await NestFactory.create(AppModule);
  
  const options = new DocumentBuilder()
    .setTitle('Terminology Service example')
    .setDescription('TS Description')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  app.setGlobalPrefix(`ts/api/${version}`);

  await app.listen(3001);
}
bootstrap();
