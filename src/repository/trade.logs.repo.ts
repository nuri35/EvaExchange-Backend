import { Injectable } from '@nestjs/common';
import { TradeLogs } from '../entities/trade.logs.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TradeLogsRepository extends Repository<TradeLogs> {
  constructor(private dataSource: DataSource) {
    super(TradeLogs, dataSource.createEntityManager());
  }

  async customCreate() {}
}
