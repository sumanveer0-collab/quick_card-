import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { CardQueueService } from './card-queue.service';
import { Card, CardSchema } from './schemas/card.schema';
import { JobQueue, JobQueueSchema } from './schemas/job-queue.schema';
import { UserModule } from '../user/user.module';
import { TemplateModule } from '../template/template.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Card.name, schema: CardSchema },
      { name: JobQueue.name, schema: JobQueueSchema },
    ]),
    UserModule,
    TemplateModule,
  ],
  controllers: [CardController],
  providers: [CardService, CardQueueService],
  exports: [CardService, MongooseModule],
})
export class CardModule {}
