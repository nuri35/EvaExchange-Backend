import { Body, Controller, Post } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import CreateExchangeDto from './dto/exchange.dto';

@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Post('/trade')
  async trade(@Body() createExchangeDto: CreateExchangeDto) {
    return this.exchangeService.trade(createExchangeDto);
  }
}
