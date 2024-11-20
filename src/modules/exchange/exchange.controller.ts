import { Body, Controller, Post } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import CreateExchangeDto from './dto/exchange.dto';
import { ExchangeResDto } from './res-dto/exchange.res.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';

@Serialize(ExchangeResDto)
@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Post('/trade')
  async trade(@Body() createExchangeDto: CreateExchangeDto) {
    return this.exchangeService.trade(createExchangeDto);
  }
}
