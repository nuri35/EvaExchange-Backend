import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post('run')
  async runSeed() {
    await this.seedService.seedDatabase();
    return { message: 'Database seeding completed successfully!' };
  }
}
