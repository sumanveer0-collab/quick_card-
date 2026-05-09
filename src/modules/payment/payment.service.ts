import {
  Injectable, BadRequestException, Logger, NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import Razorpay = require('razorpay');
import { Payment, PaymentDocument, PaymentGateway, PaymentStatus } from './schemas/payment.schema';
import { CreatePaymentOrderDto, PaymentGatewayChoice, VerifyRazorpayDto } from './dto/payment.dto';
import { UserService } from '../user/user.service';
import { UserPlan } from '../user/schemas/user.schema';

const PRO_AMOUNT = 9900; // ₹99 in paise
const PRO_PRINT_LIMIT = 5;

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private razorpay: Razorpay;

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private configService: ConfigService,
    private userService: UserService,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET'),
    });
  }

  // ─── Create Order ─────────────────────────────────────────────────────────

  async createOrder(dto: CreatePaymentOrderDto, userId: string) {
    if (dto.gateway === PaymentGatewayChoice.RAZORPAY) {
      return this.createRazorpayOrder(userId);
    }
    return this.createPhonePeOrder(userId);
  }

  private async createRazorpayOrder(userId: string) {
    const order = await this.razorpay.orders.create({
      amount: PRO_AMOUNT,
      currency: 'INR',
      receipt: `qc_${userId}_${Date.now()}`,
      notes: { userId, plan: 'pro' },
    });

    await new this.paymentModel({
      userId: new Types.ObjectId(userId),
      gateway: PaymentGateway.RAZORPAY,
      gatewayOrderId: order.id,
      plan: 'pro',
      amount: PRO_AMOUNT,
    }).save();

    return {
      message: 'Razorpay order created',
      data: {
        gateway: 'razorpay',
        orderId: order.id,
        amount: PRO_AMOUNT,
        currency: 'INR',
        keyId: this.configService.get<string>('RAZORPAY_KEY_ID'),
      },
    };
  }

  private async createPhonePeOrder(userId: string) {
    const merchantId = this.configService.get<string>('PHONEPE_MERCHANT_ID');
    const saltKey = this.configService.get<string>('PHONEPE_SALT_KEY');
    const saltIndex = this.configService.get<string>('PHONEPE_SALT_INDEX', '1');
    const baseUrl = this.configService.get<string>('PHONEPE_BASE_URL', 'https://api-preprod.phonepe.com/apis/pg-sandbox');
    const callbackUrl = `${this.configService.get<string>('BACKEND_URL', 'http://localhost:3000')}/api/v1/payment/phonepe/callback`;

    const transactionId = `QC_${userId}_${Date.now()}`;
    const payload = {
      merchantId,
      merchantTransactionId: transactionId,
      merchantUserId: userId,
      amount: PRO_AMOUNT,
      redirectUrl: callbackUrl,
      redirectMode: 'POST',
      callbackUrl,
      paymentInstrument: { type: 'PAY_PAGE' },
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const checksum = crypto
      .createHash('sha256')
      .update(`${base64Payload}/pg/v1/pay${saltKey}`)
      .digest('hex') + `###${saltIndex}`;

    const isDev = !saltKey || saltKey === 'demo';
    if (isDev) {
      // Return mock response in dev
      await new this.paymentModel({
        userId: new Types.ObjectId(userId),
        gateway: PaymentGateway.PHONEPE,
        gatewayOrderId: transactionId,
        plan: 'pro',
        amount: PRO_AMOUNT,
      }).save();

      return {
        message: 'PhonePe order created (dev mode)',
        data: { gateway: 'phonepe', transactionId, amount: PRO_AMOUNT, paymentUrl: '#dev-mode' },
      };
    }

    const response = await fetch(`${baseUrl}/pg/v1/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-VERIFY': checksum },
      body: JSON.stringify({ request: base64Payload }),
    });

    const result = await response.json() as any;
    if (!result.success) throw new BadRequestException(`PhonePe error: ${result.message}`);

    await new this.paymentModel({
      userId: new Types.ObjectId(userId),
      gateway: PaymentGateway.PHONEPE,
      gatewayOrderId: transactionId,
      plan: 'pro',
      amount: PRO_AMOUNT,
    }).save();

    return {
      message: 'PhonePe order created',
      data: {
        gateway: 'phonepe',
        transactionId,
        amount: PRO_AMOUNT,
        paymentUrl: result.data?.instrumentResponse?.redirectInfo?.url,
      },
    };
  }

  // ─── Verify Razorpay ──────────────────────────────────────────────────────

  async verifyRazorpay(dto: VerifyRazorpayDto, userId: string) {
    const expected = crypto
      .createHmac('sha256', this.configService.get<string>('RAZORPAY_KEY_SECRET'))
      .update(`${dto.razorpayOrderId}|${dto.razorpayPaymentId}`)
      .digest('hex');

    if (expected !== dto.razorpaySignature) {
      throw new BadRequestException('Invalid payment signature');
    }

    const payment = await this.paymentModel.findOne({
      gatewayOrderId: dto.razorpayOrderId,
      userId: new Types.ObjectId(userId),
    });

    if (!payment) throw new NotFoundException('Order not found');
    if (payment.status === PaymentStatus.PAID) {
      return { message: 'Already verified', data: null };
    }

    payment.gatewayPaymentId = dto.razorpayPaymentId;
    payment.status = PaymentStatus.PAID;
    payment.paidAt = new Date();
    await payment.save();

    await this.upgradeToPro(userId);
    return { message: 'Payment verified. Plan upgraded to Pro!', data: { plan: 'pro' } };
  }

  // ─── PhonePe Callback ─────────────────────────────────────────────────────

  async handlePhonePeCallback(encodedResponse: string) {
    const saltKey = this.configService.get<string>('PHONEPE_SALT_KEY');
    const saltIndex = this.configService.get<string>('PHONEPE_SALT_INDEX', '1');

    const decoded = JSON.parse(Buffer.from(encodedResponse, 'base64').toString());
    const { merchantTransactionId, transactionId, responseCode } = decoded.data || {};

    if (responseCode !== 'SUCCESS') {
      await this.paymentModel.findOneAndUpdate(
        { gatewayOrderId: merchantTransactionId },
        { status: PaymentStatus.FAILED },
      );
      return { message: 'Payment failed', data: null };
    }

    const payment = await this.paymentModel.findOne({ gatewayOrderId: merchantTransactionId });
    if (!payment || payment.status === PaymentStatus.PAID) return { message: 'Already processed', data: null };

    payment.gatewayPaymentId = transactionId;
    payment.status = PaymentStatus.PAID;
    payment.paidAt = new Date();
    await payment.save();

    await this.upgradeToPro(payment.userId.toString());
    this.logger.log(`PhonePe payment success: ${merchantTransactionId}`);
    return { message: 'Payment successful', data: { plan: 'pro' } };
  }

  // ─── Razorpay Webhook ─────────────────────────────────────────────────────

  async handleRazorpayWebhook(payload: any, signature: string) {
    const secret = this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET');
    const expected = crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');
    if (expected !== signature) throw new BadRequestException('Invalid webhook signature');

    if (payload.event === 'payment.captured') {
      const orderId = payload.payload?.payment?.entity?.order_id;
      const paymentId = payload.payload?.payment?.entity?.id;
      if (orderId) {
        const payment = await this.paymentModel.findOne({ gatewayOrderId: orderId });
        if (payment && payment.status !== PaymentStatus.PAID) {
          payment.gatewayPaymentId = paymentId;
          payment.status = PaymentStatus.PAID;
          payment.paidAt = new Date();
          await payment.save();
          await this.upgradeToPro(payment.userId.toString());
        }
      }
    }
    return { message: 'Webhook processed', data: null };
  }

  private async upgradeToPro(userId: string) {
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);
    await this.userService.updatePlan(userId, UserPlan.PRO, PRO_PRINT_LIMIT, expiresAt);

    // Remove watermark from all user cards
    const { InjectModel } = await import('@nestjs/mongoose');
    this.logger.log(`User ${userId} upgraded to Pro`);
  }

  async getHistory(userId: string) {
    const history = await this.paymentModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .select('-__v')
      .exec();
    return { message: 'Payment history', data: history };
  }
}
