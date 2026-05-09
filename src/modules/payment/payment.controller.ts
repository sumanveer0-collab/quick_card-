import {
  Controller, Post, Get, Body, Headers, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentOrderDto, VerifyRazorpayDto, PhonePeCallbackDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-order')
  createOrder(@Body() dto: CreatePaymentOrderDto, @CurrentUser('_id') userId: string) {
    return this.paymentService.createOrder(dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  verifyRazorpay(@Body() dto: VerifyRazorpayDto, @CurrentUser('_id') userId: string) {
    return this.paymentService.verifyRazorpay(dto, userId);
  }

  @Public()
  @Post('phonepe/callback')
  @HttpCode(HttpStatus.OK)
  phonePeCallback(@Body() dto: PhonePeCallbackDto) {
    return this.paymentService.handlePhonePeCallback(dto.response);
  }

  @Public()
  @Post('razorpay/webhook')
  @HttpCode(HttpStatus.OK)
  razorpayWebhook(
    @Body() payload: any,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    return this.paymentService.handleRazorpayWebhook(payload, signature);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  getHistory(@CurrentUser('_id') userId: string) {
    return this.paymentService.getHistory(userId);
  }
}
