import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShareController } from './share.controller';
import { ShareService } from './share.service';
import { ShareRepository } from 'src/repository/share.repo';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [ShareController],
  providers: [ShareService, ShareRepository],
  exports: [ShareService], // Eğer başka modüllerde kullanılacaksa
})
export class ShareModule {}
