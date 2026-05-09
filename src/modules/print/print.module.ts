import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PrintController } from './print.controller';
import { PrintService } from './print.service';
import { PrintOrder, PrintOrderSchema } from './schemas/print-order.schema';
import { CardModule } from '../card/card.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PrintOrder.name, schema: PrintOrderSchema },
    ]),
    ConfigModule,
    CardModule,
  ],
  controllers: [PrintController],
  providers: [PrintService],
  exports: [PrintService],
})
export class PrintModule {}
