import { Injectable } from '@nestjs/common';
import { TradeLogs } from '../entities/trade.logs.entity';
import { DataSource, Repository } from 'typeorm';
import { TradeType } from 'src/common/enums';
import { Share } from 'src/entities/share.entity';

@Injectable()
export class TradeLogsRepository extends Repository<TradeLogs> {
  constructor(private dataSource: DataSource) {
    super(TradeLogs, dataSource.createEntityManager());
  }

  async customCreate() {}

  async getAveragePrice(oneHourAgo: Date, share: Share) {
    const result = await this.createQueryBuilder('tradeLog')
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
    return result;
  }
}
