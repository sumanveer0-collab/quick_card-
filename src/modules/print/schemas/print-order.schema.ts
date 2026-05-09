import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PrintOrderDocument = PrintOrder & Document;

export enum PaperType {
  BASIC = 'basic',
  PREMIUM = 'premium',
  LUXURY = 'luxury',
}

export enum FinishType {
  MATTE = 'matte',
  GLOSSY = 'glossy',
}

export enum PrintOrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PRINTING = 'printing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class PrintOrder {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Card', required: true })
  cardId: Types.ObjectId;

  @Prop({ required: true, min: 50, max: 1000 })
  quantity: number;

  @Prop({ required: true, enum: PaperType })
  paperType: PaperType;

  @Prop({ required: true, enum: FinishType })
  finish: FinishType;

  @Prop({ required: true })
  price: number; // in paise

  @Prop({ type: Object, required: true })
  address: {
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };

  @Prop({ enum: PrintOrderStatus, default: PrintOrderStatus.PENDING })
  status: PrintOrderStatus;

  @Prop({ default: null })
  razorpayOrderId: string;

  @Prop({ default: null })
  trackingId: string;
}

export const PrintOrderSchema = SchemaFactory.createForClass(PrintOrder);
PrintOrderSchema.index({ userId: 1, createdAt: -1 });
