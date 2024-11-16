import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { BaseCustomEntity } from './base.entity';
import { TradeLogs } from './trade.logs.entity';

@Entity('portfolios')
export class Portfolio extends BaseCustomEntity {
  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalValue: number; // totalValue alanı, bir portföydeki mevcut hisselerin toplam değerini temsil eder. ben vermek ıstedım burada..

  @ManyToOne(() => User, (user) => user.portfolios, {
    onDelete: 'CASCADE',
    eager: true,
  })
  user: User;

  @OneToMany(() => TradeLogs, (tradeLogs) => tradeLogs.portfolio)
  tradeLogs: TradeLogs[];
}
