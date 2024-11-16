import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';
import { Portfolio } from '../../entities/portfolio.entity';
import { Share } from '../../entities/share.entity';
import { TradeLogs } from '../../entities/trade.logs.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TradeLogs, Portfolio, Share]), // Gerekli entity'ler
  ],
  controllers: [ExchangeController],
  providers: [ExchangeService],
  exports: [ExchangeService], // Eğer başka modüllerde kullanılacaksa
})
export class ExchangeModule {}
