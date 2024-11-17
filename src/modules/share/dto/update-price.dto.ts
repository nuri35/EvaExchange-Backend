import { IsNumber, IsPositive, Validate } from 'class-validator';
import { TwoDecimalPlacesValidator } from 'src/decorators/custom.validator';

export class UpdatePriceDto {
  @IsNumber()
  @IsPositive()
  @Validate(TwoDecimalPlacesValidator)
  price: number;
}
