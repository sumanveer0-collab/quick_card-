import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BusinessCardDocument = BusinessCard & Document;

@Schema()
export class CardElement {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  x: number;

  @Prop({ required: true })
  y: number;

  @Prop()
  width?: number;

  @Prop()
  height?: number;

  @Prop()
  rotation?: number;

  @Prop()
  opacity?: number;

  @Prop()
  zIndex?: number;

  @Prop()
  text?: string;

  @Prop()
  fontFamily?: string;

  @Prop()
  fontSize?: number;

  @Prop()
  fontWeight?: string;

  @Prop()
  color?: string;

  @Prop()
  textAlign?: string;

  @Prop()
  letterSpacing?: number;

  @Prop()
  lineHeight?: number;

  @Prop()
  textTransform?: string;

  @Prop()
  shape?: string;

  @Prop()
  fill?: string;

  @Prop()
  stroke?: string;

  @Prop()
  strokeWidth?: number;

  @Prop()
  borderRadius?: number;

  @Prop()
  src?: string;

  @Prop()
  qrData?: string;

  @Prop()
  qrColor?: string;

  @Prop()
  qrBackground?: string;

  @Prop({ type: Object })
  shadow?: any;

  @Prop()
  locked?: boolean;

  @Prop()
  editable?: boolean;
}

export const CardElementSchema = SchemaFactory.createForClass(CardElement);

@Schema()
export class BackgroundConfig {
  @Prop({ required: true })
  type: string;

  @Prop()
  color?: string;

  @Prop({ type: Object })
  gradient?: any;

  @Prop()
  image?: string;
}

export const BackgroundConfigSchema = SchemaFactory.createForClass(BackgroundConfig);

@Schema()
export class CardSide {
  @Prop({ type: BackgroundConfigSchema, required: true })
  background: BackgroundConfig;

  @Prop({ type: [CardElementSchema], default: [] })
  elements: CardElement[];
}

export const CardSideSchema = SchemaFactory.createForClass(CardSide);

@Schema()
export class CardMetadata {
  @Prop({ default: 85 })
  width: number;

  @Prop({ default: 55 })
  height: number;

  @Prop({ default: 'mm' })
  unit: string;

  @Prop({ default: 300 })
  dpi: number;
}

export const CardMetadataSchema = SchemaFactory.createForClass(CardMetadata);

@Schema({ timestamps: true })
export class BusinessCard {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  templateId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ type: CardSideSchema, required: true })
  front: CardSide;

  @Prop({ type: CardSideSchema, required: true })
  back: CardSide;

  @Prop({ type: CardMetadataSchema, required: true })
  metadata: CardMetadata;

  @Prop({ default: false })
  isPublic: boolean;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  thumbnail?: string;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  downloads: number;
}

export const BusinessCardSchema = SchemaFactory.createForClass(BusinessCard);

// Indexes
BusinessCardSchema.index({ userId: 1, createdAt: -1 });
BusinessCardSchema.index({ templateId: 1 });
BusinessCardSchema.index({ isPublic: 1, views: -1 });
BusinessCardSchema.index({ tags: 1 });
