import { Injectable } from '@nestjs/common';
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
    //todo yaızlcak
    return price;
  }
}
