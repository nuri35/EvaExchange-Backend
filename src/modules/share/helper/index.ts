import { Injectable } from '@nestjs/common';

// burdakı metotlarıda ayrı alt modul class haline getırıp object composition solid prenscible gibi konuları yapabilirdim... over engeenring overthink ve projenın yetişmesi için cok fazla zaman harcamamak adına bu şekilde bıraktım
@Injectable()
export class ShareHelperService {
  getUpdateInterval(): number {
    return parseInt(process.env.UPDATE_INTERVAL || '3600'); // Varsayılan: 3600 saniye (1 saat)
  }

  getAllowableUpdateTime(updateInterval: number): Date {
    return new Date(Date.now() - updateInterval * 1000);
  }

  getTimeRange(): Date {
    return new Date(Date.now() - 60 * 60 * 1000); // Son bir saat
  }

  calculateNewPrice(
    tradeData: { buyAverage: string; sellAverage: string },
    currentPrice: number,
  ): number {
    const buyAverage = parseFloat(tradeData.buyAverage || '0');
    const sellAverage = parseFloat(tradeData.sellAverage || '0');

    if (!buyAverage && !sellAverage) {
      return currentPrice; // Eğer işlem yoksa mevcut fiyatı koru
    }

    const averagePrice = (buyAverage + sellAverage) / 2;
    return parseFloat(averagePrice.toFixed(2)); // 2 ondalık basamak
  }
}
