import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { PrintService } from './print.service';
import { CreatePrintOrderDto } from './dto/create-print-order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('print')
export class PrintController {
  constructor(private readonly printService: PrintService) {}

  @Public()
  @Get('pricing')
  getPricing() {
    return this.printService.getPricingInfo();
  }

  @Post('order')
  createOrder(
    @Body() dto: CreatePrintOrderDto,
    @CurrentUser('_id') userId: string,
  ) {
    return this.printService.createOrder(dto, userId);
  }

  @Get('orders')
  getOrders(@CurrentUser('_id') userId: string) {
    return this.printService.getOrders(userId);
  }

  @Get('orders/:id')
  getOrderById(
    @Param('id') id: string,
    @CurrentUser('_id') userId: string,
  ) {
    return this.printService.getOrderById(id, userId);
  }
}
