import { Entity, Column, OneToMany } from 'typeorm';
import { TradeLogs } from './trade.logs.entity';
import { BaseCustomEntity } from './base.entity';
import { Currency } from 'src/common/enums';

@Entity('shares') //hisse tablosu
export class Share extends BaseCustomEntity {
  @Column()
  name: string; // Örnek: "Apple Inc."

  @Column({ type: 'enum', enum: Currency, default: Currency.USD })
  currency: Currency;

  @Column({ type: 'text', nullable: true })
  description?: string; // Örnek: "Technology sector stock"

  @Column({ type: 'char', length: 3, unique: true })
  symbol: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @OneToMany(() => TradeLogs, (tradeLogs) => tradeLogs.share)
  tradeLogs: TradeLogs[];
}
// Hisse senetleri kullanıcıya bağlı değildir, sistem genelindeki ortak varlıklardır.
