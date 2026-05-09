import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobQueue, JobQueueDocument, JobStatus } from './schemas/job-queue.schema';
import { Card, CardDocument } from './schemas/card.schema';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';
import { UserService } from '../user/user.service';
import { TemplateService } from '../template/template.service';
import { buildCardHtml } from './templates/card-html.builder';
import puppeteer from 'puppeteer';

@Injectable()
export class CardQueueService implements OnModuleInit {
  private readonly logger = new Logger(CardQueueService.name);
  private isProcessing = false;

  constructor(
    @InjectModel(JobQueue.name) private jobModel: Model<JobQueueDocument>,
    @InjectModel(Card.name) private cardModel: Model<CardDocument>,
    private cloudinaryService: CloudinaryService,
    private userService: UserService,
    private templateService: TemplateService,
  ) {}

  onModuleInit() {
    // Poll MongoDB every 5 seconds for pending jobs
    setInterval(() => this.processPendingJobs(), 5000);
    this.logger.log('✅ MongoDB job queue started (polling every 5s)');
  }

  async enqueue(cardId: string, printReady: boolean, userId?: string): Promise<JobQueueDocument> {
    const job = new this.jobModel({ cardId, printReady, userId: userId || null });
    return job.save();
  }

  private async processPendingJobs() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      // Grab one pending job at a time (atomic findOneAndUpdate prevents double-processing)
      const job = await this.jobModel.findOneAndUpdate(
        { status: JobStatus.PENDING },
        { status: JobStatus.PROCESSING, $inc: { attempts: 1 } },
        { new: true, sort: { createdAt: 1 } },
      );

      if (!job) return;

      this.logger.log(`Processing job ${job._id} — card ${job.cardId} printReady=${job.printReady}`);

      try {
        const resultUrl = await this.generateCardImage(job.cardId, job.printReady, job.userId);
        await this.jobModel.findByIdAndUpdate(job._id, {
          status: JobStatus.DONE,
          resultUrl,
        });
        this.logger.log(`✅ Job ${job._id} done: ${resultUrl}`);
      } catch (err) {
        const failed = job.attempts >= 3;
        await this.jobModel.findByIdAndUpdate(job._id, {
          status: failed ? JobStatus.FAILED : JobStatus.PENDING,
          error: err.message,
        });
        this.logger.error(`❌ Job ${job._id} failed (attempt ${job.attempts}): ${err.message}`);
      }
    } finally {
      this.isProcessing = false;
    }
  }

  private async generateCardImage(cardId: string, printReady: boolean, userId?: string): Promise<string> {
    const card = await this.cardModel.findById(cardId).populate('templateId').exec();
    if (!card) throw new Error(`Card ${cardId} not found`);

    // After populate, templateId is the full document — extract _id safely
    const templateId = (card.templateId as any)?._id?.toString() || card.templateId?.toString();
    const template = await this.templateService.findById(templateId);

    // Skip Puppeteer rendering when Cloudinary is in demo mode — no point rendering
    // if we can't store the result. The card is still fully functional without imageUrl.
    const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY || '';
    const isDemoMode = !cloudinaryApiKey || cloudinaryApiKey === 'demo' || cloudinaryApiKey.startsWith('demo');
    if (isDemoMode) {
      this.logger.debug(`Demo mode: skipping Puppeteer render for card ${cardId}`);
      return '';
    }

    const html = buildCardHtml(card, template, printReady);
    const imageBuffer = await this.renderWithPuppeteer(html, printReady);

    const folder = printReady ? 'quickcard/print-ready' : 'quickcard/cards';
    const publicId = `${printReady ? 'print' : 'card'}-${cardId}`;

    const upload = await this.cloudinaryService.uploadBuffer(imageBuffer, folder, publicId, 'image');

    // Update card with the new image URL
    const updateField = printReady ? 'printReadyUrl' : 'imageUrl';
    if (upload.secure_url) {
      await this.cardModel.findByIdAndUpdate(cardId, { [updateField]: upload.secure_url });
    }

    // Increment print usage for print-ready jobs
    if (printReady && userId) {
      await this.userService.incrementPrintUsage(userId);
    }

    return upload.secure_url || '';
  }

  private async renderWithPuppeteer(html: string, printReady: boolean): Promise<Buffer> {
    const scale = printReady ? 300 / 96 : 1;
    const vpW = Math.round(336 * scale);
    const vpH = Math.round(192 * scale);

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--font-render-hinting=none',
      ],
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: vpW, height: vpH, deviceScaleFactor: scale });
      await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.evaluateHandle('document.fonts.ready');

      const screenshot = await page.screenshot({
        type: 'png',
        clip: { x: 0, y: 0, width: vpW, height: vpH },
        omitBackground: false,
      });

      return Buffer.from(screenshot);
    } finally {
      await browser.close();
    }
  }

  async getJobStatus(jobId: string) {
    return this.jobModel.findById(jobId).select('-__v').exec();
  }
}
