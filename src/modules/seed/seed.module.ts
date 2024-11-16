import { Logger, Module } from '@nestjs/common';
import { SeedService } from './seed.service';
@Module({
  providers: [SeedService, Logger],
  exports: [SeedService], // SeedService'in başka yerlerde kullanılabilir olması için
})
export class SeedModule {}
