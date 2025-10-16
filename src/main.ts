import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn']
  });

  app.use(express.json({ limit: '1gb' }));
  app.use(express.urlencoded({ limit: '1gb', extended: true }));
  app.use(express.raw({ limit: '1gb' }));


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'static'), {
    prefix: '/static/',
  });
  app.setGlobalPrefix('api/v1/auth');

  const config = new DocumentBuilder()
    .setTitle('API Auth Services')
    .setDescription('API de Autenticación para el sistema mobile tracking')
    .setVersion('v1')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-upc-mb-cloud-auth', app, document, {
    customCss: `
    .topbar-wrapper img,
    .topbar-wrapper svg,
    .topbar .link {
      display: none !important;
    }
    .topbar-wrapper::after {
      content: '';
      background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Logotipo_Sodimac.svg/2560px-Logotipo_Sodimac.svg.png');
      background-size: contain;
      background-repeat: no-repeat;
      width: 180px;
      height: 40px;
      display: block;
    } 
  `,
    customSiteTitle: 'API Auth Tracking',
    customfavIcon: 'https://consultaguias.sodimacperu.pe/static/media/logo.7cf5096956102d3c94ec.png',
  });

  app.enableCors();

  const port = 3000;
  const server = await app.listen(port);
  server.setTimeout(600000);
}

bootstrap();
