import {
  Injectable, NotFoundException, ForbiddenException, Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import * as QRCode from 'qrcode';
import { Card, CardDocument } from './schemas/card.schema';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { UserService } from '../user/user.service';
import { TemplateService } from '../template/template.service';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';
import { CardQueueService } from './card-queue.service';
import { UserDocument, UserPlan } from '../user/schemas/user.schema';

const PRINT_LIMITS: Record<UserPlan, number> = {
  [UserPlan.FREE]: 0,
  [UserPlan.PRO]: 5,
};

@Injectable()
export class CardService {
  private readonly logger = new Logger(CardService.name);

  constructor(
    @InjectModel(Card.name) private cardModel: Model<CardDocument>,
    private userService: UserService,
    private templateService: TemplateService,
    private cloudinaryService: CloudinaryService,
    private cardQueueService: CardQueueService,
  ) {}

  async create(dto: CreateCardDto, user: UserDocument) {
    const template = await this.templateService.findById(dto.templateId);
    const shareSlug = uuidv4().replace(/-/g, '').substring(0, 12);
    const hasWatermark = user.plan === UserPlan.FREE;

    let qrCodeUrl: string | null = null;
    if (dto.qrEnabled) {
      try {
        const shareUrl = `${process.env.FRONTEND_URL || 'https://quickcard.app'}/c/${shareSlug}`;
        const qrBuffer = await QRCode.toBuffer(shareUrl, { width: 300, margin: 2 });
        const qrUpload = await this.cloudinaryService.uploadBuffer(qrBuffer, 'quickcard/qr-codes', `qr-${shareSlug}`);
        qrCodeUrl = qrUpload.secure_url || null;
      } catch (err) {
        this.logger.warn(`QR code upload skipped: ${err.message}`);
        // Card creation continues without QR — user can enable it later
      }
    }

    const card = new this.cardModel({
      userId: user._id,
      ...dto,
      templateId: new Types.ObjectId(dto.templateId),
      category: template.category,
      shareSlug,
      qrCodeUrl,
      hasWatermark,
    });

    const saved = await card.save();
    const job = await this.cardQueueService.enqueue(saved._id.toString(), false);
    this.logger.log(`Card created: ${saved._id} | Job: ${job._id}`);
    return { message: 'Card created successfully', data: saved };
  }

  async update(cardId: string, dto: UpdateCardDto, userId: string) {
    const card = await this.findById(cardId, userId);

    // If template changed, update category
    if (dto.templateId) {
      const template = await this.templateService.findById(dto.templateId);
      (dto as any).category = template.category;
      (dto as any).templateId = new Types.ObjectId(dto.templateId);
    }

    // Regenerate QR if phone/slug changed
    if (dto.qrEnabled !== undefined && dto.qrEnabled && !card.qrCodeUrl) {
      try {
        const shareUrl = `${process.env.FRONTEND_URL || 'https://quickcard.app'}/c/${card.shareSlug}`;
        const qrBuffer = await QRCode.toBuffer(shareUrl, { width: 300, margin: 2 });
        const qrUpload = await this.cloudinaryService.uploadBuffer(qrBuffer, 'quickcard/qr-codes', `qr-${card.shareSlug}`);
        (dto as any).qrCodeUrl = qrUpload.secure_url || null;
      } catch (err) {
        this.logger.warn(`QR code upload skipped on update: ${err.message}`);
      }
    }

    const updated = await this.cardModel.findByIdAndUpdate(
      cardId,
      { $set: dto },
      { new: true },
    ).populate('templateId');

    // Re-queue image generation
    await this.cardQueueService.enqueue(cardId, false);

    return { message: 'Card updated', data: updated };
  }

  async duplicate(cardId: string, user: UserDocument) {
    const original = await this.findById(cardId, user._id.toString());
    const shareSlug = uuidv4().replace(/-/g, '').substring(0, 12);

    const copy = new this.cardModel({
      ...original.toObject(),
      _id: new Types.ObjectId(),
      shareSlug,
      imageUrl: null,
      printReadyUrl: null,
      qrCodeUrl: null,
      createdAt: undefined,
      updatedAt: undefined,
    });

    const saved = await copy.save();
    await this.cardQueueService.enqueue(saved._id.toString(), false);
    return { message: 'Card duplicated', data: saved };
  }

  async list(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [cards, total] = await Promise.all([
      this.cardModel
        .find({ userId, isActive: true })
        .populate('templateId', 'name category previewImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-__v')
        .exec(),
      this.cardModel.countDocuments({ userId, isActive: true }),
    ]);

    return {
      message: 'Cards fetched',
      data: cards,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(cardId: string, userId?: string): Promise<CardDocument> {
    const filter: any = { _id: cardId };
    if (userId) filter.userId = userId;
    const card = await this.cardModel.findOne(filter).populate('templateId').exec();
    if (!card) throw new NotFoundException('Card not found');
    return card;
  }

  async findBySlug(slug: string): Promise<CardDocument> {
    const card = await this.cardModel.findOne({ shareSlug: slug, isActive: true }).populate('templateId').exec();
    if (!card) throw new NotFoundException('Card not found');
    return card;
  }

  async delete(cardId: string, userId: string) {
    const card = await this.cardModel.findOneAndUpdate(
      { _id: cardId, userId },
      { isActive: false },
      { new: true },
    );
    if (!card) throw new NotFoundException('Card not found');
    return { message: 'Card deleted', data: null };
  }

  async generatePrintReady(cardId: string, user: UserDocument) {
    const card = await this.findById(cardId, user._id.toString());
    const limit = PRINT_LIMITS[user.plan] ?? 0;

    if (limit === 0) throw new ForbiddenException('Upgrade to Pro for print-ready export.');
    if (user.printReadyUsed >= user.printReadyLimit) {
      throw new ForbiddenException(`Monthly limit reached (${user.printReadyLimit}). Resets next month.`);
    }

    const job = await this.cardQueueService.enqueue(card._id.toString(), true, user._id.toString());
    return { message: 'Print-ready generation queued', data: { jobId: job._id, cardId: card._id } };
  }

  async getJobStatus(jobId: string) {
    const job = await this.cardQueueService.getJobStatus(jobId);
    if (!job) throw new NotFoundException('Job not found');
    return { message: 'Job status', data: job };
  }

  async updateImageUrl(cardId: string, imageUrl: string, printReady = false) {
    const update = printReady ? { printReadyUrl: imageUrl } : { imageUrl };
    return this.cardModel.findByIdAndUpdate(cardId, update, { new: true });
  }
}
