import { Entity, Column, ManyToOne } from 'typeorm';
import { Portfolio } from './portfolio.entity';
import { Share } from './share.entity';
import { BaseCustomEntity } from './base.entity';
import { TradeType } from 'src/common/enums';

@Entity('tradeLogs')
export class TradeLogs extends BaseCustomEntity {
  @ManyToOne(() => Portfolio, (portfolio) => portfolio.tradeLogs, {
    eager: false,
  })
  portfolio: Portfolio;

  @ManyToOne(() => Share, (share) => share.tradeLogs, {
    eager: false,
  })
  share: Share;

  @Column({ type: 'enum', enum: TradeType })
  type: TradeType;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
}
// Alış (BUY) ve satış (SELL) işlemlerini kaydeder. Hangi portföyde hangi hisseyle işlem yapıldığını, işlem türünü (BUY/SELL), miktarını ve fiyatını saklar.
