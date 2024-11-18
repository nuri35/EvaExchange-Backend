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

    // 1. Kullanıcı Doğrulama
    //? aslında dto.userId dışardan vermek yerıne jwt ara katmanda publıcId deceode edip redis yada postgresde istek atarak  user kotnrol edilip ordan userId alınabilir... ben daha cok alım satım işlemlerıne odaklandım...
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
    //todo anladıgım kadarıyla bu sekılde calsııyor mantık olarak ... yarın bı kısa bakıp artık satış kısmına gecersın  ona göre kodların eklersın... biter enson....
    const price = share.price; // Güncel fiyat

    // 5. Trade Log Kaydı
    await this.tradeLogsRepo.save({
      portfolio,
      share,
      type,
      quantity,
      price, // Güncel fiyat kullanılıyor
    });
  }
}

// bir hisse yönetim endpoint'i gerekebilir. saatlik hisse fiyatları adına en son bakılacak.. kullanıcları saatlık olarak price update edecek..

// tradelogs tablonda alıcı satıcı ıslem mıktar o kademedekı fıyat durur...
// hisse tablosuna

// saatlık bılgı en son oluşan tradelogsdakı kayıt price larak  ...

// tradelogs kaydı yok hıc kayıt yok hissedekı price ı al...

//saatlık bılgıde

//tiker

// tradelogs tablosunda alım satım tek bır rowda olmas lazım ayrı ayrı degıl..
// biri alan biri satan.... alan tarafın bilgisi satan bilgisini  vs zaman damgasını koycaksın
