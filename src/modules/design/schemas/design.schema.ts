import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DesignDocument = Design & Document;

// Element types for the canvas
export enum ElementType {
  TEXT = 'text',
  IMAGE = 'image',
  SHAPE = 'shape',
  LOGO = 'logo',
  QR = 'qr',
}

// Shape types
export enum ShapeType {
  RECT = 'rect',
  CIRCLE = 'circle',
  LINE = 'line',
}

// Canvas element interface
export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;

  // Text properties
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  align?: 'left' | 'center' | 'right' | 'justify';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  letterSpacing?: number;
  lineHeight?: number;
  padding?: { horizontal: number; vertical: number };

  // Image properties
  src?: string;

  // Shape properties
  shapeType?: ShapeType;
  cornerRadius?: number;

  // Layer properties
  zIndex: number;
  locked?: boolean;
  visible?: boolean;
  opacity?: number;
}

// Canvas configuration
export interface CanvasConfig {
  width: number;
  height: number;
  background: string;
  showGrid?: boolean;
  showBleed?: boolean;
  showTrim?: boolean;
  showSafety?: boolean;
}

@Schema({ timestamps: true })
export class Design {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  designName: string;

  @Prop({ type: Object, required: true })
  canvas: CanvasConfig;

  @Prop({ type: [Object], required: true, default: [] })
  elements: CanvasElement[];

  @Prop({ default: null })
  previewImage?: string; // Base64 or URL to thumbnail

  @Prop({ default: false })
  isTemplate: boolean; // Can be saved as template

  @Prop({ default: true })
  isActive: boolean;

  // Metadata
  @Prop({ default: 0 })
  version: number; // For tracking design versions

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>; // Additional metadata (tags, notes, etc.)
}

export const DesignSchema = SchemaFactory.createForClass(Design);

// Indexes for performance
DesignSchema.index({ userId: 1, createdAt: -1 });
DesignSchema.index({ userId: 1, designName: 1 });
DesignSchema.index({ isTemplate: 1, isActive: 1 });
