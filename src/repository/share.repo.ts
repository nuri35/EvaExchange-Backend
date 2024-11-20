import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Share } from '../entities/share.entity';

@Injectable()
export class ShareRepository extends Repository<Share> {
  constructor(private dataSource: DataSource) {
    super(Share, dataSource.createEntityManager());
  }

  async customFindOne(shareId: number) {
    return await this.findOne({
      select: {
        id: true,
        price: true,
        updatedAt: true,
      },
      where: { id: shareId },
    });
  }

  async updateNewPrice(share: Share, newPrice: number) {
    share.price = newPrice;
    await this.save(share);
  }
}
