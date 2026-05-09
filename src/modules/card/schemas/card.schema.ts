import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CardDocument = Card & Document;

@Schema({ timestamps: true })
export class Card {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  businessName: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ trim: true, default: '' })
  address: string;

  @Prop({ trim: true, default: '' })
  website: string;

  // Social links
  @Prop({ type: Object, default: {} })
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    whatsapp?: string;
  };

  @Prop({ default: null })
  logoUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'Template', required: true })
  templateId: Types.ObjectId;

  @Prop({ required: true })
  category: string;

  @Prop({ default: false })
  qrEnabled: boolean;

  @Prop({ default: null })
  qrCodeUrl: string;

  @Prop({ default: 'light', enum: ['light', 'dark'] })
  themeMode: string;

  @Prop({ unique: true, sparse: true })
  shareSlug: string;

  @Prop({ default: null })
  imageUrl: string;

  @Prop({ default: null })
  printReadyUrl: string;

  @Prop({ default: null })
  tagline: string;

  @Prop({ type: [String], default: [] })
  services: string[];

  @Prop({ type: Object, default: null })
  colorTheme: Record<string, string>;

  // Watermark: shown for free users
  @Prop({ default: true })
  hasWatermark: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

export const CardSchema = SchemaFactory.createForClass(Card);
CardSchema.index({ userId: 1, createdAt: -1 });
CardSchema.index({ shareSlug: 1 });
