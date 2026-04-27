import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Marketplace API')
    .addBearerAuth()
    .setDescription(
      `
      Marketplace API hujjatlari.
      Rollar: ADMIN, SELLER, BUYER
      
      Xatolik statuslari:
      - 200/201: OK
      - 400: Bad Request
      - 401: Unauthorized
      - 403: Forbidden (Ruxsat yo'q)
      - 409: Conflict
    `,
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`Server running on: http://localhost:${PORT}`);
}
bootstrap();
