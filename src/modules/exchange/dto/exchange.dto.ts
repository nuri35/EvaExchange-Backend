import { IsInt, IsEnum, Min } from 'class-validator';
import { TradeType } from 'src/common/enums';

class CreateExchangeDto {
  @IsInt()
  @Min(1)
  userId: number;

  @IsInt()
  @Min(1)
  portfolioId: number;

  @IsInt()
  @Min(1)
  shareId: number; // Hisse ID

  @IsEnum(TradeType)
  type: TradeType;

  @IsInt()
  @Min(1)
  quantity: number;
}

export default CreateExchangeDto;
