import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Portfolio } from '../../entities/portfolio.entity';
import { Share } from '../../entities/share.entity';
import { TradeLogs } from '../../entities/trade.logs.entity';
import { TradeType } from '../../common/enums';
import { faker } from '@faker-js/faker';

@Injectable()
export class SeedService {
  constructor(private readonly dataSource: DataSource) {}

  async seedDatabase() {
    const userRepo = this.dataSource.getRepository(User);
    const portfolioRepo = this.dataSource.getRepository(Portfolio);
    const shareRepo = this.dataSource.getRepository(Share);
    const tradeLogRepo = this.dataSource.getRepository(TradeLogs);

    console.log('Starting database seeding...');

    // 1. Faker.js ile kullanıcıları oluştur

    const users = await userRepo.save(
      Array.from({ length: 5 }).map(() => ({
        name: faker.name.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number({ style: 'national' }),
        address: faker.location.streetAddress(),
      })),
    );
    //seed ıcın yaptıgım ıcın array ıcınde mapliyor burası ıcın save metotlarına cok odaklanmamıza gerek yok...sadece typeorm metotlarını kullandım raw sql kullanmadım..  normal service içerisinde  arrayli kaydetmeleri for dongusu vs için yapmazdım...

    console.log('Users created:', users);

    // 2. Faker.js ile hisseleri oluştur
    const shares = await shareRepo.save(
      Array.from({ length: 5 }).map(() => ({
        name: faker.company.name(), // Şirket ismi
        symbol: faker.string.alpha({ length: 3, casing: 'upper' }), // 3 harfli büyük harf sembol
        price: parseFloat(faker.finance.amount()),
      })),
    );

    console.log('Shares created:', shares);

    // 3. Portföyleri oluştur ve işlemleri ekle
    for (const user of users) {
      // Portföy oluştur
      const portfolio = await portfolioRepo.save({
        name: `${user.name}'s Portfolio`,
        user,
        totalValue: 0, // Başlangıç değeri
      });

      console.log(`Portfolio created for user: ${user.name}`, portfolio);

      // İşlemleri oluştur ve işle
      const tradeLogsPromises = shares.map(async (share) => {
        const type = faker.helpers.arrayElement([
          TradeType.BUY,
          TradeType.SELL,
        ]);
        const quantity = faker.number.int({ min: 1, max: 20 });
        const price = share.price; // Şu anki fiyat

        // Portföydeki toplam hisse miktarını kontrol et (SELL işlemi için gerekli)
        if (type === TradeType.SELL) {
          const existingLogs = await tradeLogRepo.find({
            where: { portfolio: { id: portfolio.id }, share: { id: share.id } },
          });

          const totalBought = existingLogs
            .filter((log) => log.type === TradeType.BUY)
            .reduce((sum, log) => sum + log.quantity, 0);

          const totalSold = existingLogs
            .filter((log) => log.type === TradeType.SELL)
            .reduce((sum, log) => sum + log.quantity, 0);

          const currentQuantity = totalBought - totalSold;

          if (quantity > currentQuantity) {
            console.log(
              `Insufficient shares for SELL operation on portfolio ${portfolio.name} for share ${share.name}. Available: ${currentQuantity}, required: ${quantity}`,
            );
            return;
          }
        }

        // İşlemi kaydet
        await tradeLogRepo.save({
          portfolio,
          share,
          type,
          quantity,
          price,
        });

        // TotalValue'yi güncelle
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

        console.log(
          `${type} operation performed on portfolio ${portfolio.name} for share ${share.name}. Quantity: ${quantity}, Price: ${price}`,
        );
      });

      await Promise.all(tradeLogsPromises);
    }

    console.log('Database seeding completed successfully.');
  }
}

//! burası seeder mantıgında calıstıgı ıcın performans uzerıne birşey yapmadım... mantık uzerınden daha çok veri eklemesı yaptım...

// Avantajlar
// Kontrollü Çalıştırma:

// Seed işlemi yalnızca manuel bir HTTP isteğiyle başlatılır.
// Otomatik başlatma gibi sorunları önler.
// Esneklik:

// Gerekirse farklı seed endpoint'leri eklenebilir.
// Örneğin, yalnızca kullanıcıları seed etmek için ayrı bir endpoint tanımlanabilir.
// Güvenli Kullanım:

// Seed işlemi sadece belirli bir erişime sahip olan kişiler tarafından çalıştırılabilir (örn. admin yetkilendirme eklenerek). ıstersek boyle sınırlama getirebiliriz. endpointine ben suan ıcın getırmedım..
