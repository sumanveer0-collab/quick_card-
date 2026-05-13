import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessCardController } from './business-card.controller';
import { BusinessCardService } from './business-card.service';
import { BusinessCard, BusinessCardSchema } from './schemas/business-card.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BusinessCard.name, schema: BusinessCardSchema },
    ]),
  ],
  controllers: [BusinessCardController],
  providers: [BusinessCardService],
  exports: [BusinessCardService],
})
export class BusinessCardModule {}
