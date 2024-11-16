import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import helmet from 'helmet';
import { Logger } from '@nestjs/common';
import * as morgan from 'morgan';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { GlobalExceptionFilter } from './shared/http-exception.filter';

// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { apiDescription } from './document/description';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.use(morgan('short'));

  app.use(helmet());
  app.use(compression());

  // Global Logger
  const logger = new Logger('Bootstrap');
  app.useLogger(logger); // Logger'ı tüm uygulamaya entegre et

  const reflector = app.get(Reflector);

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));

  (app as any).set('etag', false);
  app.use((req, res, next) => {
    res.removeHeader('x-powered-by');
    res.removeHeader('date');
    next();
  });
  // const config = new DocumentBuilder()
  //   .setTitle('NestJS API')
  //   .setDescription(apiDescription)
  //   .setVersion('1.0')
  //   .addTag('nestjs')
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api/v1/docs', app, document);

  logger.log('Starting the application...');
  await app.listen(8000);
  logger.log(`Application is running on: http://localhost:3000`);
}
bootstrap();
