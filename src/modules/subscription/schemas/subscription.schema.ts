import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

export enum SubscriptionStatus {
  CREATED = 'created',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Schema({ timestamps: true })
export class Subscription {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  razorpayOrderId: string;

  @Prop({ default: null })
  razorpayPaymentId: string;

  @Prop({ default: null })
  razorpaySignature: string;

  @Prop({ required: true, enum: ['basic', 'pro'] })
  plan: string;

  @Prop({ required: true })
  amount: number; // in paise

  @Prop({ enum: SubscriptionStatus, default: SubscriptionStatus.CREATED })
  status: SubscriptionStatus;

  @Prop({ default: null })
  paidAt: Date;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
SubscriptionSchema.index({ razorpayOrderId: 1 });
SubscriptionSchema.index({ userId: 1, status: 1 });
