import { Module } from '@nestjs/common';
import { ShareController } from './share.controller';
import { ShareService } from './share.service';
import { CardModule } from '../card/card.module';

@Module({
  imports: [CardModule],
  controllers: [ShareController],
  providers: [ShareService],
})
export class ShareModule {}
