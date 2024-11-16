import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Share } from '../entities/share.entity';

@Injectable()
export class ShareRepository extends Repository<Share> {
  constructor(private dataSource: DataSource) {
    super(Share, dataSource.createEntityManager());
  }
}
