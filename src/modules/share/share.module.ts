import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShareController } from './share.controller';
import { ShareService } from './share.service';
import { ShareRepository } from 'src/repository/share.repo';
import { TradeLogs } from 'src/entities/trade.logs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TradeLogs])],
  controllers: [ShareController],
  providers: [ShareService, ShareRepository],
  exports: [ShareService], // Eğer başka modüllerde kullanılacaksa
})
export class ShareModule {}
