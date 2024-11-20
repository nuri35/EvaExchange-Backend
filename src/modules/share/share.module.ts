import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShareController } from './share.controller';
import { ShareService } from './share.service';
import { ShareRepository } from 'src/repository/share.repo';
import { TradeLogsRepository } from 'src/repository/trade.logs.repo';
import { ShareHelperService } from './helper';
import { AverageCalculator } from 'src/solid-principle/subClass/average.calculator';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [ShareController],
  providers: [
    ShareService,
    ShareRepository,
    TradeLogsRepository,
    ShareHelperService,
    AverageCalculator,
  ],
  exports: [ShareService], // Eğer başka modüllerde kullanılacaksa
})
export class ShareModule {}
