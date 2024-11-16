import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PortfolioRepository } from 'src/repository/portfolio.repo';
import { ShareRepository } from 'src/repository/share.repo';
import { UserRepository } from 'src/repository/user.repo';
import { TradeLogsRepository } from 'src/repository/trade.logs.repo';
import { TryCatch } from 'src/decorators/try.catch';

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

  //
  @TryCatch()
  async trade() {}
}

//!task analız edildi 2 onemlı endpoint yapıalcak.. ılk  Trade Logs yazabilriz. dırek bu endpointten başlarız ve logiclerini service yazarak ilerleriz....
// bir hisse yönetim endpoint'i gerekebilir. saatlik hisse fiyatları adına en son bakılacak.. kullanıcları saatlık olarak price update edecek..
// Evet, ılk  Trade Logs yazabilriz. için bir endpoint şart. ve istedıklerı case'lere dikkat edecegız..
