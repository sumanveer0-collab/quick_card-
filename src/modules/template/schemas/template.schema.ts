import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TemplateDocument = Template & Document;

export enum TemplateCategory {
  MINIMAL = 'minimal',
  PROFESSIONAL = 'professional',
  CREATIVE = 'creative',
  FOOD = 'food',
  BEAUTY = 'beauty',
  FITNESS = 'fitness',
  LOCAL = 'local',
  CORPORATE = 'corporate',
}

@Schema({ timestamps: true })
export class Template {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, enum: TemplateCategory })
  category: TemplateCategory;

  @Prop({ required: true })
  previewImage: string;

  @Prop({ default: false })
  isPremium: boolean;

  @Prop({ type: Object, required: true })
  layoutConfig: Record<string, any>;

  // Front face HTML/CSS (with {{placeholders}})
  @Prop({ default: null })
  frontHTML: string;

  @Prop({ default: null })
  frontCSS: string;

  // Back face HTML/CSS
  @Prop({ default: null })
  backHTML: string;

  @Prop({ default: null })
  backCSS: string;

  // Legacy single-face fields (kept for backward compat)
  @Prop({ default: null })
  html: string;

  @Prop({ default: null })
  css: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
TemplateSchema.index({ category: 1, isActive: 1 });
