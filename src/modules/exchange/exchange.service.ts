import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PortfolioRepository } from 'src/repository/portfolio.repo';
import { ShareRepository } from 'src/repository/share.repo';
import { UserRepository } from 'src/repository/user.repo';
import { TradeLogsRepository } from 'src/repository/trade.logs.repo';
import { TryCatch } from 'src/decorators/try.catch';
import CreateExchangeDto from './dto/exchange.dto';

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
    const { userId } = dto;

    // 1. Kullanıcı Doğrulama

    const user = await this.userRepo.customFindOne(userId);

    if (!user) {
      throw new NotFoundException();
    }
  }
}

// bir hisse yönetim endpoint'i gerekebilir. saatlik hisse fiyatları adına en son bakılacak.. kullanıcları saatlık olarak price update edecek..
