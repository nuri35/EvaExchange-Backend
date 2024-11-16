import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { SeedService } from './seed.service';

@Injectable()
export class SeedCommand {
  constructor(private readonly seedService: SeedService) {}

  @Command({
    command: 'db:seed',
    describe: 'Seed the database with initial data',
  })
  async run() {
    console.log('Starting database seeding...');
    await this.seedService.seedDatabase();
    console.log('Database seeding completed.');
  }
}
