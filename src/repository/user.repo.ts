import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async customFindOne(userId: number) {
    return this.findOne({
      select: {
        id: true,
      },
      where: {
        id: userId,
      },
    });
  }
}
