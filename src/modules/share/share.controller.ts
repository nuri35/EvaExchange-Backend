import { Controller, Patch, Param } from '@nestjs/common';
import { ShareService } from './share.service';

@Controller('shares')
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @Patch(':id/price')
  async updatePrice(@Param('id') id: number) {
    return this.shareService.updatePrice(id);
  }
}
