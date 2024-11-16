import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module'; // Ana modül yolu
import { SeedService } from '../modules/seed/seed.service'; // SeedService yolu
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const logger = new Logger('SeedScript'); // Logger örneği
  const seedService = app.get(SeedService); // SeedService'i al

  logger.log('Starting database seeding...');

  try {
    await seedService.seedDatabase(); // Seed işlemini başlat
    logger.log('Database seeding completed successfully.');
  } catch (error) {
    logger.error('Error during database seeding', error.stack);
  } finally {
    await app.close(); // Uygulamayı kapat
    logger.log('Application context closed.');
  }
}

bootstrap();
