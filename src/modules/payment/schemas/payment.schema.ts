import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

export enum PaymentGateway {
  RAZORPAY = 'razorpay',
  PHONEPE = 'phonepe',
}

export enum PaymentStatus {
  CREATED = 'created',
  PAID = 'paid',
  FAILED = 'failed',
}

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: PaymentGateway })
  gateway: PaymentGateway;

  @Prop({ required: true })
  gatewayOrderId: string;

  @Prop({ default: null })
  gatewayPaymentId: string;

  @Prop({ required: true, enum: ['pro'] })
  plan: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ enum: PaymentStatus, default: PaymentStatus.CREATED })
  status: PaymentStatus;

  @Prop({ default: null })
  paidAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
PaymentSchema.index({ gatewayOrderId: 1 });
