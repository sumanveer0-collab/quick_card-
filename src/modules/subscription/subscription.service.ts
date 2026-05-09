import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import Razorpay = require('razorpay');
import { Subscription, SubscriptionDocument, SubscriptionStatus } from './schemas/subscription.schema';
import { CreateOrderDto, SubscriptionPlan } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { UserService } from '../user/user.service';
import { UserPlan } from '../user/schemas/user.schema';

const PLAN_CONFIG = {
  [SubscriptionPlan.PRO]: {
    amount: 9900,
    printLimit: 5,
    userPlan: UserPlan.PRO,
    label: 'Pro Plan - ₹99/month',
  },
};

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);
  private razorpay: Razorpay;

  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
    private configService: ConfigService,
    private userService: UserService,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET'),
    });
  }

  async createOrder(dto: CreateOrderDto, userId: string) {
    const config = PLAN_CONFIG[dto.plan];
    if (!config) throw new BadRequestException('Invalid plan');

    const order = await this.razorpay.orders.create({
      amount: config.amount,
      currency: 'INR',
      receipt: `qc_${userId}_${Date.now()}`,
      notes: {
        userId,
        plan: dto.plan,
      },
    });

    // Save pending subscription
    const subscription = new this.subscriptionModel({
      userId: new Types.ObjectId(userId),
      razorpayOrderId: order.id,
      plan: dto.plan,
      amount: config.amount,
      status: SubscriptionStatus.CREATED,
    });
    await subscription.save();

    this.logger.log(`Order created: ${order.id} for user ${userId}`);

    return {
      message: 'Order created',
      data: {
        orderId: order.id,
        amount: config.amount,
        currency: 'INR',
        plan: dto.plan,
        label: config.label,
        keyId: this.configService.get<string>('RAZORPAY_KEY_ID'),
      },
    };
  }

  async verifyPayment(dto: VerifyPaymentDto, userId: string) {
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', this.configService.get<string>('RAZORPAY_KEY_SECRET'))
      .update(`${dto.razorpayOrderId}|${dto.razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== dto.razorpaySignature) {
      throw new BadRequestException('Payment verification failed: invalid signature');
    }

    // Find subscription
    const subscription = await this.subscriptionModel.findOne({
      razorpayOrderId: dto.razorpayOrderId,
      userId: new Types.ObjectId(userId),
    });

    if (!subscription) throw new NotFoundException('Order not found');
    if (subscription.status === SubscriptionStatus.PAID) {
      return { message: 'Payment already verified', data: null };
    }

    // Update subscription
    subscription.razorpayPaymentId = dto.razorpayPaymentId;
    subscription.razorpaySignature = dto.razorpaySignature;
    subscription.status = SubscriptionStatus.PAID;
    subscription.paidAt = new Date();
    await subscription.save();

    // Update user plan
    const config = PLAN_CONFIG[subscription.plan as SubscriptionPlan];
    const planExpiresAt = new Date();
    planExpiresAt.setMonth(planExpiresAt.getMonth() + 1);

    await this.userService.updatePlan(
      userId,
      config.userPlan,
      config.printLimit,
      planExpiresAt,
    );

    this.logger.log(`Payment verified: ${dto.razorpayPaymentId} for user ${userId}`);

    return {
      message: 'Payment verified successfully',
      data: {
        plan: subscription.plan,
        printLimit: config.printLimit,
        expiresAt: planExpiresAt,
      },
    };
  }

  async handleWebhook(payload: any, signature: string) {
    const webhookSecret = this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET');

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new BadRequestException('Invalid webhook signature');
    }

    const event = payload.event;
    this.logger.log(`Webhook received: ${event}`);

    if (event === 'payment.captured') {
      const payment = payload.payload?.payment?.entity;
      const orderId = payment?.order_id;

      if (orderId) {
        const subscription = await this.subscriptionModel.findOne({
          razorpayOrderId: orderId,
        });

        if (subscription && subscription.status !== SubscriptionStatus.PAID) {
          subscription.status = SubscriptionStatus.PAID;
          subscription.razorpayPaymentId = payment.id;
          subscription.paidAt = new Date();
          await subscription.save();

          const config = PLAN_CONFIG[subscription.plan as SubscriptionPlan];
          if (config) {
            const planExpiresAt = new Date();
            planExpiresAt.setMonth(planExpiresAt.getMonth() + 1);
            await this.userService.updatePlan(
              subscription.userId.toString(),
              config.userPlan,
              config.printLimit,
              planExpiresAt,
            );
          }
        }
      }
    }

    if (event === 'subscription.charged') {
      // Handle recurring subscription reset
      const sub = payload.payload?.subscription?.entity;
      if (sub?.notes?.userId) {
        await this.userService.resetMonthlyUsage(sub.notes.userId);
      }
    }

    return { message: 'Webhook processed', data: null };
  }

  async getHistory(userId: string) {
    const history = await this.subscriptionModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .select('-__v')
      .exec();

    return { message: 'Subscription history fetched', data: history };
  }
}
