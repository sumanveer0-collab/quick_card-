import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JobQueueDocument = JobQueue & Document;

export enum JobStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  DONE = 'done',
  FAILED = 'failed',
}

@Schema({ timestamps: true })
export class JobQueue {
  @Prop({ required: true })
  cardId: string;

  @Prop({ required: true, default: false })
  printReady: boolean;

  @Prop({ default: null })
  userId: string;

  @Prop({ enum: JobStatus, default: JobStatus.PENDING, index: true })
  status: JobStatus;

  @Prop({ default: 0 })
  attempts: number;

  @Prop({ default: null })
  error: string;

  @Prop({ default: null })
  resultUrl: string;
}

export const JobQueueSchema = SchemaFactory.createForClass(JobQueue);
JobQueueSchema.index({ status: 1, createdAt: 1 });
