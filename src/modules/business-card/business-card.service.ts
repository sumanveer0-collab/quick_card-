import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BusinessCard, BusinessCardDocument } from './schemas/business-card.schema';
import { CreateBusinessCardDto } from './dto/create-business-card.dto';
import { UpdateBusinessCardDto } from './dto/update-business-card.dto';

@Injectable()
export class BusinessCardService {
  constructor(
    @InjectModel(BusinessCard.name)
    private businessCardModel: Model<BusinessCardDocument>,
  ) {}

  async create(
    userId: string,
    createDto: CreateBusinessCardDto,
  ): Promise<BusinessCard> {
    const businessCard = new this.businessCardModel({
      ...createDto,
      userId: new Types.ObjectId(userId),
    });
    return businessCard.save();
  }

  async findAll(userId: string): Promise<BusinessCard[]> {
    return this.businessCardModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string, userId: string): Promise<BusinessCard> {
    const businessCard = await this.businessCardModel
      .findOne({
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      })
      .exec();

    if (!businessCard) {
      throw new NotFoundException('Business card not found');
    }

    return businessCard;
  }

  async update(
    id: string,
    userId: string,
    updateDto: UpdateBusinessCardDto,
  ): Promise<BusinessCard> {
    const businessCard = await this.businessCardModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          userId: new Types.ObjectId(userId),
        },
        { $set: updateDto },
        { new: true },
      )
      .exec();

    if (!businessCard) {
      throw new NotFoundException('Business card not found');
    }

    return businessCard;
  }

  async delete(id: string, userId: string): Promise<void> {
    const result = await this.businessCardModel
      .deleteOne({
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('Business card not found');
    }
  }

  async findPublic(limit: number = 20): Promise<BusinessCard[]> {
    return this.businessCardModel
      .find({ isPublic: true })
      .sort({ views: -1, createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async incrementViews(id: string): Promise<void> {
    await this.businessCardModel
      .updateOne(
        { _id: new Types.ObjectId(id) },
        { $inc: { views: 1 } },
      )
      .exec();
  }

  async incrementDownloads(id: string): Promise<void> {
    await this.businessCardModel
      .updateOne(
        { _id: new Types.ObjectId(id) },
        { $inc: { downloads: 1 } },
      )
      .exec();
  }

  async findByTemplate(templateId: string): Promise<BusinessCard[]> {
    return this.businessCardModel
      .find({ templateId })
      .sort({ createdAt: -1 })
      .limit(10)
      .exec();
  }

  async searchByTags(tags: string[]): Promise<BusinessCard[]> {
    return this.businessCardModel
      .find({
        isPublic: true,
        tags: { $in: tags },
      })
      .sort({ views: -1 })
      .limit(20)
      .exec();
  }
}
