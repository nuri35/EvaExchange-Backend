import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Portfolio } from '../entities/portfolio.entity';

@Injectable()
export class PortfolioRepository extends Repository<Portfolio> {
  constructor(private dataSource: DataSource) {
    super(Portfolio, dataSource.createEntityManager());
  }
  async customFindOne(portfolioId: number, userId: number) {
    return await this.findOne({
      where: { id: portfolioId, user: { id: userId } },
    });
  }
}
