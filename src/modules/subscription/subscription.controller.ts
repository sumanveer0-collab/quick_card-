import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  UseGuards,
  RawBodyRequest,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-order')
  createOrder(
    @Body() dto: CreateOrderDto,
    @CurrentUser('_id') userId: string,
  ) {
    return this.subscriptionService.createOrder(dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  verifyPayment(
    @Body() dto: VerifyPaymentDto,
    @CurrentUser('_id') userId: string,
  ) {
    return this.subscriptionService.verifyPayment(dto, userId);
  }

  @Public()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  webhook(
    @Body() payload: any,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    return this.subscriptionService.handleWebhook(payload, signature);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  getHistory(@CurrentUser('_id') userId: string) {
    return this.subscriptionService.getHistory(userId);
  }
}
