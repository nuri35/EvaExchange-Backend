import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PortfolioRepository } from 'src/repository/portfolio.repo';
import { ShareRepository } from 'src/repository/share.repo';
import { UserRepository } from 'src/repository/user.repo';
import { TradeLogsRepository } from 'src/repository/trade.logs.repo';
import { TryCatch } from 'src/decorators/try.catch';
import CreateExchangeDto from './dto/exchange.dto';
import { TradeType } from 'src/common/enums';
import { Portfolio } from 'src/entities/portfolio.entity';
import { Share } from 'src/entities/share.entity';

@Injectable()
export class ExchangeService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepo: UserRepository,

    @InjectRepository(PortfolioRepository)
    private readonly portfolioRepo: PortfolioRepository,

    @InjectRepository(ShareRepository)
    private readonly shareRepo: ShareRepository,

    @InjectRepository(TradeLogsRepository)
    private readonly tradeLogsRepo: TradeLogsRepository,
  ) {}

  @TryCatch()
  async trade(dto: CreateExchangeDto) {
    const { userId, type, quantity } = dto;

    const user = await this.userRepo.customFindOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2. Portföy Doğrulama
    const portfolio = await this.portfolioRepo.customFindOne(
      dto.portfolioId,
      user.id,
    );
    if (!portfolio) {
      throw new BadRequestException(
        'Portfolio not found or does not belong to the user',
      );
    }

    // 3. Hisse Doğrulama
    const share = await this.shareRepo.customFindOne(dto.shareId);
    if (!share) {
      throw new BadRequestException('Share not found');
    }

    // 4. Fiyat Güncellenme Zamanı Kontrolü
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1 saat önce
    //not: projede share tablosunda başka bir alan guncellenmedıgı ıcın updatedAt alanını kullandım..
    if (share.updatedAt < oneHourAgo) {
      throw new BadRequestException(
        'The price for this share is outdated. Please update the price before trading.',
      );
    }

    const price = share.price; // Güncel fiyat

    if (type === TradeType.SELL) {
      const canSell = await this.checkSellConditions(
        portfolio,
        share,
        quantity,
      );
      if (!canSell) {
        throw new BadRequestException('Insufficient quantity to sell');
      }
    }

    await this.tradeLogsRepo.save({
      portfolio,
      share,
      type,
      quantity,
      price,
    });
  }

  /**
   * Satış işlemi için gerekli doğrulamaları yapar.
   */
  private async checkSellConditions(
    portfolio: Portfolio,
    share: Share,
    quantity: number,
  ): Promise<boolean> {
    const result = await this.tradeLogsRepo
      .createQueryBuilder('tradeLog')
      .select(
        'SUM(CASE WHEN tradeLog.type = :buy THEN tradeLog.quantity ELSE 0 END)',
        'totalBought',
      )
      .addSelect(
        'SUM(CASE WHEN tradeLog.type = :sell THEN tradeLog.quantity ELSE 0 END)',
        'totalSold',
      )
      .where('tradeLog.portfolioId = :portfolioId', {
        portfolioId: portfolio.id,
      })
      .andWhere('tradeLog.shareId = :shareId', { shareId: share.id })
      .setParameters({ buy: TradeType.BUY, sell: TradeType.SELL })
      .getRawOne();

    const totalBought = parseInt(result.totalBought || '0', 10);
    const totalSold = parseInt(result.totalSold || '0', 10);

    const availableQuantity = totalBought - totalSold;

    return quantity <= availableQuantity;
  }
}
