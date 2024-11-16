import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from './../../entities/user.entity';
import { Portfolio } from './../../entities/portfolio.entity';
import { Share } from './../../entities/share.entity';
import { TradeLogs } from './../../entities/trade.logs.entity';
import { TradeType } from '../../common/enums';

@Injectable()
export class SeedService {
  constructor(private readonly dataSource: DataSource) {}

  async seedDatabase() {
    const userRepo = this.dataSource.getRepository(User);
    const portfolioRepo = this.dataSource.getRepository(Portfolio);
    const shareRepo = this.dataSource.getRepository(Share);
    const tradeLogRepo = this.dataSource.getRepository(TradeLogs);

    console.log('Starting database seeding...');
    return;
    // 1. Kullanıcıları oluştur
    const users = await userRepo.save([
      { name: 'User 1', email: 'user1@example.com', password: 'password' },
      { name: 'User 2', email: 'user2@example.com', password: 'password' },
      { name: 'User 3', email: 'user3@example.com', password: 'password' },
      { name: 'User 4', email: 'user4@example.com', password: 'password' },
      { name: 'User 5', email: 'user5@example.com', password: 'password' },
    ]);

    console.log('Users created:', users);

    // 2. Hisseleri oluştur
    const shares = await shareRepo.save([
      { name: 'Apple Inc.', symbol: 'AAPL', price: 150.5 },
      { name: 'Tesla Inc.', symbol: 'TSLA', price: 650.75 },
      { name: 'Amazon Inc.', symbol: 'AMZN', price: 120.0 },
    ]);

    console.log('Shares created:', shares);

    // 3. Portföy ve işlemleri oluştur
    for (const user of users) {
      const portfolio = await portfolioRepo.save({
        name: `${user.name}'s Portfolio`,
        user,
      });

      console.log(`Portfolio created for user: ${user.name}`, portfolio);

      // 4. İşlemleri (BUY/SELL) oluştur
      await tradeLogRepo.save([
        {
          portfolio,
          share: shares[0],
          type: TradeType.BUY,
          quantity: 10,
          price: 150.5,
        },
        {
          portfolio,
          share: shares[1],
          type: TradeType.SELL,
          quantity: 5,
          price: 650.75,
        },
      ]);

      console.log(`TradeLogs created for user: ${user.name}`);
    }

    console.log('Database seeding completed successfully.');
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
