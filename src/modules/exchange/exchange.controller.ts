import { Controller, Post } from '@nestjs/common';
import { ExchangeService } from './exchange.service';

@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Post('/trade')
  async trade() {
    return this.exchangeService.trade();
  }
}
