import { Expose } from 'class-transformer';
import { TradeType } from 'src/common/enums';

export class ExchangeResDto {
  @Expose({
    name: 'id',
  })
  publicId: number;

  @Expose()
  type: TradeType;

  @Expose()
  quantity: number;

  @Expose()
  price: number;
}
