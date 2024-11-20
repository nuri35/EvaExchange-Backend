import { Injectable } from '@nestjs/common';
import { TradeLogs } from '../entities/trade.logs.entity';
import { DataSource, Repository } from 'typeorm';
import { TradeType } from 'src/common/enums';
import { Share } from 'src/entities/share.entity';
import { TradeAverages, TradeTotals } from 'src/interfaces/trade.interface';

@Injectable()
export class TradeLogsRepository extends Repository<TradeLogs> {
  constructor(private dataSource: DataSource) {
    super(TradeLogs, dataSource.createEntityManager());
  }

  async customCreate() {}

  async getAveragePrice(oneHourAgo: Date, share: Share) {
    const result: TradeAverages = await this.createQueryBuilder('tradeLog')
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

  async getTotalBoughtAndSold(portfolioId: number, shareId: number) {
    const result: TradeTotals = await this.createQueryBuilder('tradeLog')
      .select(
        'SUM(CASE WHEN tradeLog.type = :buy THEN tradeLog.quantity ELSE 0 END)',
        'totalBought',
      )
      .addSelect(
        'SUM(CASE WHEN tradeLog.type = :sell THEN tradeLog.quantity ELSE 0 END)',
        'totalSold',
      )
      .where('tradeLog.portfolioId = :portfolioId', {
        portfolioId,
      })
      .andWhere('tradeLog.shareId = :shareId', { shareId })
      .setParameters({ buy: TradeType.BUY, sell: TradeType.SELL })
      .getRawOne();

    return result;
  }
}
