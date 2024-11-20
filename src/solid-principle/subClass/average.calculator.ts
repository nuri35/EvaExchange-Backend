import { TradeAverages } from 'src/interfaces/trade.interface';
import { AbstractCalculator } from './../calculateMain';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AverageCalculator extends AbstractCalculator<
  TradeAverages,
  number
> {
  protected calculate(data: TradeAverages): number {
    const buyAverage = parseFloat(data.buyAverage || '0');
    const sellAverage = parseFloat(data.sellAverage || '0');

    if (!buyAverage && !sellAverage) {
      return 0;
    }

    const averagePrice = (buyAverage + sellAverage) / 2;

    return parseFloat(averagePrice.toFixed(2));
  }
}
