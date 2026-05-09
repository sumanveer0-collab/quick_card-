import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import Razorpay = require('razorpay');
import { PrintOrder, PrintOrderDocument, PaperType, FinishType } from './schemas/print-order.schema';
import { CreatePrintOrderDto } from './dto/create-print-order.dto';
import { CardService } from '../card/card.service';

// Pricing in paise (₹)
const PRICING = {
  base: 200,        // ₹2 per card base
  paper: {
    [PaperType.BASIC]: 0,
    [PaperType.PREMIUM]: 100,   // +₹1 per card
    [PaperType.LUXURY]: 300,    // +₹3 per card
  },
  finish: {
    [FinishType.MATTE]: 0,
    [FinishType.GLOSSY]: 50,    // +₹0.50 per card
  },
  minimumOrder: 5000, // ₹50 minimum
};

@Injectable()
export class PrintService {
  private readonly logger = new Logger(PrintService.name);
  private razorpay: Razorpay;

  constructor(
    @InjectModel(PrintOrder.name)
    private printOrderModel: Model<PrintOrderDocument>,
    private configService: ConfigService,
    private cardService: CardService,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET'),
    });
  }

  calculatePrice(quantity: number, paperType: PaperType, finish: FinishType): number {
    const perCardPrice =
      PRICING.base +
      PRICING.paper[paperType] +
      PRICING.finish[finish];

    const total = perCardPrice * quantity;
    return Math.max(total, PRICING.minimumOrder);
  }

  async createOrder(dto: CreatePrintOrderDto, userId: string) {
    // Validate card exists and belongs to user
    const card = await this.cardService.findById(dto.cardId, userId);

    if (!card.printReadyUrl) {
      throw new BadRequestException(
        'Card does not have a print-ready file. Please generate print-ready version first.',
      );
    }

    const price = this.calculatePrice(dto.quantity, dto.paperType, dto.finish);

    // Create Razorpay order
    const razorpayOrder = await this.razorpay.orders.create({
      amount: price,
      currency: 'INR',
      receipt: `print_${userId}_${Date.now()}`,
      notes: {
        userId,
        cardId: dto.cardId,
        type: 'print_order',
      },
    });

    const printOrder = new this.printOrderModel({
      userId: new Types.ObjectId(userId),
      cardId: new Types.ObjectId(dto.cardId),
      quantity: dto.quantity,
      paperType: dto.paperType,
      finish: dto.finish,
      price,
      address: dto.address,
      razorpayOrderId: razorpayOrder.id,
    });

    const saved = await printOrder.save();
    this.logger.log(`Print order created: ${saved._id} for user ${userId}`);

    return {
      message: 'Print order created',
      data: {
        orderId: saved._id,
        razorpayOrderId: razorpayOrder.id,
        price,
        priceDisplay: `₹${(price / 100).toFixed(2)}`,
        quantity: dto.quantity,
        paperType: dto.paperType,
        finish: dto.finish,
        keyId: this.configService.get<string>('RAZORPAY_KEY_ID'),
      },
    };
  }

  async getOrders(userId: string) {
    const orders = await this.printOrderModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('cardId', 'businessName imageUrl printReadyUrl')
      .sort({ createdAt: -1 })
      .select('-__v')
      .exec();

    return { message: 'Print orders fetched', data: orders };
  }

  async getOrderById(orderId: string, userId: string) {
    const order = await this.printOrderModel
      .findOne({ _id: orderId, userId: new Types.ObjectId(userId) })
      .populate('cardId')
      .exec();

    if (!order) throw new NotFoundException('Print order not found');
    return { message: 'Print order fetched', data: order };
  }

  getPricingInfo() {
    return {
      message: 'Pricing info',
      data: {
        basePerCard: '₹2.00',
        paperUpgrade: {
          basic: '₹0.00',
          premium: '+₹1.00 per card',
          luxury: '+₹3.00 per card',
        },
        finishUpgrade: {
          matte: '₹0.00',
          glossy: '+₹0.50 per card',
        },
        minimumOrder: '₹50.00',
        minimumQuantity: 50,
        maximumQuantity: 1000,
      },
    };
  }
}
