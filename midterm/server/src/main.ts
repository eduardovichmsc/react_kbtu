import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Enable CORS for frontend applications
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global prefix for all API endpoints
  app.setGlobalPrefix('api');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Setup Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Aura Decor & Coffee API')
    .setDescription(
      'RESTful API бэкенд для интернет-магазина декора и кофейных аксессуаров Aura. Включает эндпоинты для каталога товаров, категорий, пакетов оформления (pricing), оформления заявок и контактов.',
    )
    .setVersion('1.0.0')
    .addTag('Товары (Products)', 'Каталог, детальные карточки, категории и поиск')
    .addTag('Пакеты услуг (Pricing)', 'Тарифы и пакеты декора для бизнеса')
    .addTag('Заявки и контакты (Contact & Orders)', 'Оформление смет и консультаций')
    .addTag('Конфигурация (Config)', 'Данные компании, контакты, соцсети')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`🚀 Сервер запущен: http://localhost:${port}`);
  logger.log(`📚 Swagger документация доступна: http://localhost:${port}/api/docs`);
}

void bootstrap();
