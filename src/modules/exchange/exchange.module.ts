import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';

import { UserRepository } from 'src/repository/user.repo';
import { PortfolioRepository } from 'src/repository/portfolio.repo';
import { ShareRepository } from 'src/repository/share.repo';
import { TradeLogsRepository } from 'src/repository/trade.logs.repo';
import { TotalCalculator } from 'src/solid-principle/subClass/total.calculate';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [ExchangeController],
  providers: [
    ExchangeService,
    UserRepository,
    PortfolioRepository,
    ShareRepository,
    TradeLogsRepository,
    TotalCalculator,
  ],
  exports: [ExchangeService], // Eğer başka modüllerde kullanılacaksa
})
export class ExchangeModule {}
