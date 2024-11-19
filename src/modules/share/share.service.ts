import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TradeType } from 'src/common/enums';
import { TradeLogs } from 'src/entities/trade.logs.entity';

import { ShareRepository } from 'src/repository/share.repo';
import { Repository } from 'typeorm';

@Injectable()
export class ShareService {
  constructor(
    @InjectRepository(ShareRepository)
    private readonly shareRepo: ShareRepository,
    @InjectRepository(TradeLogs)
    private readonly tradeLogsRepo: Repository<TradeLogs>,
  ) {}

  async updatePrice(id: number) {
    const share = await this.shareRepo.customFindOne(id);
    if (!share) {
      throw new BadRequestException('Share not found');
    }

    const updateInterval = parseInt(process.env.UPDATE_INTERVAL || '3600'); // Varsayılan: 3600 saniye (1 saat)
    const allowableUpdateTime = new Date(Date.now() - updateInterval * 1000);

    if (share.updatedAt >= allowableUpdateTime) {
      throw new BadRequestException(
        `Price can only be updated after ${updateInterval / 60} minutes since the last update.`,
      );
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // Alım ve Satım Ortalama Fiyatlarını SQL ile Hesapla
    const result = await this.tradeLogsRepo
      .createQueryBuilder('tradeLog')
      .select(
        `AVG(CASE WHEN tradeLog.type = :buy THEN tradeLog.price ELSE NULL END)`,
        'buyAverage',
      )
      .addSelect(
        `AVG(CASE WHEN tradeLog.type = :sell THEN tradeLog.price ELSE NULL END)`,
        'sellAverage',
      )
      .where('tradeLog.shareId = :shareId', { shareId: share.id })
      .andWhere('tradeLog.createdAt > :oneHourAgo', { oneHourAgo })
      .setParameters({ buy: TradeType.BUY, sell: TradeType.SELL })
      .getRawOne();

    const buyAverage = parseFloat(result.buyAverage || '0');
    const sellAverage = parseFloat(result.sellAverage || '0');

    // Yeni Fiyatı Hesapla
    if (!buyAverage && !sellAverage) {
      throw new NotFoundException('No trades found in the last hour');
    }
    console.log(result);

    const newPrice = (buyAverage + sellAverage) / 2;

    // Share Tablosunu Güncelle
    share.price = parseFloat(newPrice.toFixed(2)); // 2 ondalık basamak
    await this.shareRepo.save(share);

    return { newPrice: share.price, message: 'Price updated successfully' };
  }
}
