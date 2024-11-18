import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatePriceDto } from './dto/update-price.dto';
import { ShareRepository } from 'src/repository/share.repo';

@Injectable()
export class ShareService {
  constructor(
    @InjectRepository(ShareRepository)
    private readonly shareRepo: ShareRepository,
  ) {}

  async updatePrice(id: number, updatePriceDto: UpdatePriceDto) {
    const { price } = updatePriceDto;

    const share = await this.shareRepo.customFindOne(id);
    if (!share) {
      throw new BadRequestException('Share not found');
    }

    const updateInterval = parseInt(process.env.UPDATE_INTERVAL || '3600'); // Varsayılan: 3600 saniye (1 saat)
    const allowableUpdateTime = new Date(Date.now() - updateInterval * 1000);

    if (share.updatedAt >= allowableUpdateTime) {
      throw new BadRequestException(
        `Price can only be updated after ${updateInterval / 60} minutes since the last update.`,
      );
    }

    // Güncelleme İşlemi
    share.price = price;
    await this.shareRepo.save(share);

    return {
      message: 'Price updated successfully',
      shareId: id,
      newPrice: price,
    };
  }
}
