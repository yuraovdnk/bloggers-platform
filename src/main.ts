import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { mapValidationErrors } from './exceptions/mapErrors';
import { ErrorExceptionFilter, HttpExceptionFilter } from './exceptions/exception.filter';

export const createApp = async (app) => {
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      exceptionFactory: mapValidationErrors,
    }),
  );
  return app;
};
async function bootstrap() {
  let app = await NestFactory.create(AppModule);
  app = await createApp(app);
  app.useGlobalFilters(new ErrorExceptionFilter(), new HttpExceptionFilter());
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
