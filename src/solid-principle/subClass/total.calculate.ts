import { TradeTotals } from 'src/interfaces/trade.interface';
import { AbstractCalculator } from './../calculateMain';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TotalCalculator extends AbstractCalculator<TradeTotals, boolean> {
  protected calculate(data: TradeTotals, quantity: number) {
    const totalBought = parseInt(String(data.totalBought || '0'), 10);
    const totalSold = parseInt(String(data.totalSold || '0'), 10);

    const availableQuantity = totalBought - totalSold; // Kullanılabilir miktar

    return quantity <= availableQuantity;
  }
}
