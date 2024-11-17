import { Controller, Patch, Param, Body } from '@nestjs/common';
import { ShareService } from './share.service';
import { UpdatePriceDto } from './dto/update-price.dto';

@Controller('shares')
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @Patch(':id/price')
  async updatePrice(
    @Param('id') id: number,
    @Body() updatePriceDto: UpdatePriceDto,
  ) {
    return this.shareService.updatePrice(id, updatePriceDto);
  }
}
