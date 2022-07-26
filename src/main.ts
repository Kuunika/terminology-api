import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  const config = app.get<ConfigService>(ConfigService);
  app.setGlobalPrefix(
    `api/${config.get<string>('TERMINOLOGY_SERVICE_API_VERSION')}`,
  );

  const options = new DocumentBuilder()
    .setTitle('Terminology Service example')
    .setDescription('TS Description')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  
  const PORT = config.get<number>('PORT');
  await app.listen(PORT);
}
bootstrap();
