import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserPlan {
  FREE = 'free',
  PRO = 'pro',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ trim: true, maxlength: 100, default: '' })
  name: string;

  @Prop({ unique: true, sparse: true, lowercase: true, trim: true })
  email: string;

  @Prop({ default: null })
  password: string;

  // OTP phone login
  @Prop({ unique: true, sparse: true, trim: true })
  phone: string;

  @Prop({ default: null })
  otp: string;

  @Prop({ default: null })
  otpExpiresAt: Date;

  @Prop({ enum: UserPlan, default: UserPlan.FREE })
  plan: UserPlan;

  @Prop({ default: 0 })
  aiUsageCount: number;

  @Prop({ default: '' })
  aiUsageDate: string;

  @Prop({ default: 0 })
  printReadyUsed: number;

  @Prop({ default: 0 })
  printReadyLimit: number;

  @Prop({ default: null })
  avatarUrl: string;

  @Prop({ default: null })
  razorpayCustomerId: string;

  @Prop({ default: null })
  subscriptionId: string;

  @Prop({ default: null })
  planExpiresAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });
