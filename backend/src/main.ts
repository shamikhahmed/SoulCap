import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(ConfigService);

  app.use(helmet({ contentSecurityPolicy: config.get('app.env') === 'production' }));
  app.use(compression());

  app.enableCors({
    origin: config.get<string>('app.allowedOrigins', '*').split(','),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Organization-Id', 'X-Idempotency-Key', 'X-Request-Id', 'X-Clinical-Demo', 'svix-id', 'svix-timestamp', 'svix-signature'],
    credentials: true,
  });

  app.enableVersioning({ type: VersioningType.URI });
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  if (config.get('app.env') !== 'production') {
    const swaggerDoc = new DocumentBuilder()
      .setTitle('Living Mind API')
      .setDescription('AI Emotional Intelligence Platform — Living Mind Model backend')
      .setVersion('1.0')
      .addBearerAuth()
      .addApiKey({ type: 'apiKey', in: 'header', name: 'X-Organization-Id' }, 'org-id')
      .build();
    SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerDoc), {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  app.enableShutdownHooks();

  const port = config.get<number>('app.port', 3000);
  await app.listen(port);
  console.log(`Living Mind API on :${port} [${config.get('app.env')}]`);
}

bootstrap().catch((err) => { console.error(err); process.exit(1); });
