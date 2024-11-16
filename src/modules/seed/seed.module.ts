import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from './../../entities/user.entity';
import { Portfolio } from './../../entities/portfolio.entity';
import { Share } from './../../entities/share.entity';
import { TradeLogs } from './../../entities/trade.logs.entity';
import { SeedController } from './seed.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Portfolio, Share, TradeLogs])],
  providers: [SeedService],
  controllers: [SeedController],
})
export class SeedModule {}
