import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShareRepository } from 'src/repository/share.repo';
import { TradeLogsRepository } from 'src/repository/trade.logs.repo';
import { ShareHelperService } from './helper';
import { AverageCalculator } from 'src/solid-principle/subClass/average.calculator';

@Injectable()
export class ShareService {
  constructor(
    @InjectRepository(ShareRepository)
    private readonly shareRepo: ShareRepository,
    @InjectRepository(TradeLogsRepository)
    private readonly tradeLogsRepo: TradeLogsRepository,
    private readonly shareHelperService: ShareHelperService,
    private readonly averageCalculator: AverageCalculator,
  ) {}

  async updatePrice(id: number) {
    const share = await this.shareRepo.customFindOne(id);
    if (!share) {
      throw new BadRequestException('Share not found');
    }

    const updateInterval = this.shareHelperService.getUpdateInterval();
    const allowableUpdateTime =
      this.shareHelperService.getAllowableUpdateTime(updateInterval);

    if (share.updatedAt >= allowableUpdateTime) {
      throw new BadRequestException(
        `Price can only be updated after ${updateInterval / 60} minutes since the last update.`,
      );
    }

    const tradeData = await this.tradeLogsRepo.getAveragePrice(
      this.shareHelperService.getTimeRange(),
      share,
    );

    const newPrice = this.averageCalculator.run(tradeData);

    if (newPrice === 0) {
      return { newPrice: share.price, message: 'Price not updated' };
    }

    await this.shareRepo.updateNewPrice(share, newPrice);

    return { newPrice: share.price, message: 'Price updated successfully' };
  }
}
