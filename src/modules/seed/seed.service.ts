import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Portfolio } from '../../entities/portfolio.entity';
import { Share } from '../../entities/share.entity';
import { TradeLogs } from '../../entities/trade.logs.entity';
import { TradeType } from '../../common/enums';
import { faker } from '@faker-js/faker';
import { TryCatch } from 'src/decorators/try.catch';

@Injectable()
export class SeedService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: Logger, // Logger inject edildi
  ) {}

  @TryCatch()
  async seedDatabase() {
    const userRepo = this.dataSource.getRepository(User);
    const portfolioRepo = this.dataSource.getRepository(Portfolio);
    const shareRepo = this.dataSource.getRepository(Share);
    const tradeLogRepo = this.dataSource.getRepository(TradeLogs);

    // 1. Kullanıcıları oluştur
    const users = await userRepo.save(
      Array.from({ length: 5 }).map(() => ({
        name: faker.name.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number({ style: 'national' }),
        address: faker.location.streetAddress(),
      })),
    );
    this.logger.log(`Users created!!!!!`);

    // 2. Hisseleri oluştur
    const shares = await shareRepo.save(
      Array.from({ length: 5 }).map(() => ({
        name: faker.company.name(),
        symbol: faker.string.alpha({ length: 3, casing: 'upper' }),
        price: parseFloat(faker.finance.amount()),
      })),
    );
    this.logger.log(`Shares created!!!!!`);

    // 3. Portföyleri oluştur ve işlemleri ekle
    for (const user of users) {
      const portfolio = await portfolioRepo.save({
        name: `${user.name}'s Portfolio`,
        user,
        totalValue: 0,
      });
      this.logger.log(
        `Portfolio created for user: ${user.name}, Portfolio: ${JSON.stringify(
          portfolio,
        )}`,
      );

      const tradeLogsPromises = shares.map(async (share) => {
        const type = faker.helpers.arrayElement([
          TradeType.BUY,
          TradeType.SELL,
        ]);

        const quantity = faker.number.int({ min: 1, max: 20 });
        const price = parseFloat(share.price.toFixed(2)); // Price 2 ondalık basamaklı olmalı

        if (type === TradeType.SELL) {
          // SELL işlemi için gerekli kontrol
          const existingLogs = await tradeLogRepo.find({
            where: {
              portfolio: { id: portfolio.id },
              share: { id: share.id },
            },
          });

          const totalBought = existingLogs
            .filter((log) => log.type === TradeType.BUY)
            .reduce((sum, log) => sum + log.quantity, 0);

          const totalSold = existingLogs
            .filter((log) => log.type === TradeType.SELL)
            .reduce((sum, log) => sum + log.quantity, 0);

          const currentQuantity = totalBought - totalSold;

          if (quantity > currentQuantity) {
            this.logger.warn(
              `Insufficient shares for SELL operation on portfolio ${portfolio.name} for share ${share.name}. Available: ${currentQuantity}, required: ${quantity}`,
            );
            return; // Satış mümkün değilse işlemi atla
          }
        }

        // TradeLogs tablosuna kaydet
        await tradeLogRepo.save({
          portfolio,
          share,
          type,
          quantity,
          price, // 2 ondalık basamaklı fiyat
        });

        // Portfolio'nun totalValue değerini güncelle
        if (type === TradeType.BUY) {
          await this.dataSource.manager.increment(
            Portfolio,
            { id: portfolio.id },
            'totalValue',
            quantity * price,
          );
        } else if (type === TradeType.SELL) {
          await this.dataSource.manager.decrement(
            Portfolio,
            { id: portfolio.id },
            'totalValue',
            quantity * price,
          );
        }

        this.logger.log(
          `${type} operation performed on portfolio ${portfolio.name} for share ${share.name}. Quantity: ${quantity}, Price: ${price}`,
        );
      });

      // Tüm işlemler tamamlanana kadar bekle
      await Promise.all(tradeLogsPromises);
    }
  }
}

// Avantajlar
// Kontrollü Çalıştırma:

// Seed işlemi yalnızca manuel bir HTTP isteğiyle başlatılır.
// Otomatik başlatma gibi sorunları önler.
// Esneklik:

// Gerekirse farklı seed endpoint'leri eklenebilir.
// Örneğin, yalnızca kullanıcıları seed etmek için ayrı bir endpoint tanımlanabilir.
// Güvenli Kullanım:

// Seed işlemi sadece belirli bir erişime sahip olan kişiler tarafından çalıştırılabilir (örn. admin yetkilendirme eklenerek). ıstersek boyle sınırlama getirebiliriz. endpointine ben suan ıcın getırmedım..
