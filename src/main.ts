import { HttpExceptionFilter } from 'src/common/filters/bad-request.filter';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key: fs.readFileSync('key.pvk'),
      cert: fs.readFileSync('cert.cer'),
    },
  });

  const configService = app.get(ConfigService);
  const { origin } = configService.get('cors');

  app.enableCors({
    origin,
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get('Reflector')));
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(configService.get<number>('PORT') || 3000);

  app.getHttpServer();
}

bootstrap();
