import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Design, DesignDocument } from './schemas/design.schema';
import { CreateDesignDto } from './dto/create-design.dto';
import { UpdateDesignDto } from './dto/update-design.dto';

@Injectable()
export class DesignService {
  constructor(
    @InjectModel(Design.name) private designModel: Model<DesignDocument>,
  ) {}

  /**
   * Create a new design
   */
  async create(userId: string, createDesignDto: CreateDesignDto): Promise<Design> {
    // Validate elements array
    if (!createDesignDto.elements || createDesignDto.elements.length === 0) {
      throw new BadRequestException('Design must have at least one element');
    }

    // Sanitize inputs
    const sanitizedDto = this.sanitizeDesignData(createDesignDto);

    const design = new this.designModel({
      userId: new Types.ObjectId(userId),
      ...sanitizedDto,
      version: 1,
    });

    return design.save();
  }

  /**
   * Get all designs for a user
   */
  async findAllByUser(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ designs: Design[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const [designs, total] = await Promise.all([
      this.designModel
        .find({ userId: new Types.ObjectId(userId), isActive: true })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.designModel.countDocuments({ userId: new Types.ObjectId(userId), isActive: true }),
    ]);

    return {
      designs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get a single design by ID
   */
  async findOne(designId: string, userId: string): Promise<Design> {
    if (!Types.ObjectId.isValid(designId)) {
      throw new BadRequestException('Invalid design ID');
    }

    const design = await this.designModel
      .findOne({
        _id: new Types.ObjectId(designId),
        userId: new Types.ObjectId(userId),
        isActive: true,
      })
      .lean()
      .exec();

    if (!design) {
      throw new NotFoundException('Design not found');
    }

    return design;
  }

  /**
   * Update a design
   */
  async update(
    designId: string,
    userId: string,
    updateDesignDto: UpdateDesignDto,
  ): Promise<Design> {
    if (!Types.ObjectId.isValid(designId)) {
      throw new BadRequestException('Invalid design ID');
    }

    // Check ownership
    const existingDesign = await this.designModel.findOne({
      _id: new Types.ObjectId(designId),
      userId: new Types.ObjectId(userId),
    });

    if (!existingDesign) {
      throw new NotFoundException('Design not found');
    }

    // Sanitize inputs
    const sanitizedDto = this.sanitizeDesignData(updateDesignDto);

    // Increment version
    const updatedDesign = await this.designModel
      .findByIdAndUpdate(
        designId,
        {
          ...sanitizedDto,
          $inc: { version: 1 },
        },
        { new: true, runValidators: true },
      )
      .lean()
      .exec();

    return updatedDesign;
  }

  /**
   * Delete a design (soft delete)
   */
  async remove(designId: string, userId: string): Promise<{ message: string }> {
    if (!Types.ObjectId.isValid(designId)) {
      throw new BadRequestException('Invalid design ID');
    }

    const design = await this.designModel.findOne({
      _id: new Types.ObjectId(designId),
      userId: new Types.ObjectId(userId),
    });

    if (!design) {
      throw new NotFoundException('Design not found');
    }

    // Soft delete
    await this.designModel.findByIdAndUpdate(designId, { isActive: false });

    return { message: 'Design deleted successfully' };
  }

  /**
   * Duplicate a design
   */
  async duplicate(designId: string, userId: string): Promise<Design> {
    if (!Types.ObjectId.isValid(designId)) {
      throw new BadRequestException('Invalid design ID');
    }

    const originalDesign = await this.findOne(designId, userId);

    const duplicatedDesign = new this.designModel({
      userId: new Types.ObjectId(userId),
      designName: `${originalDesign.designName} (Copy)`,
      canvas: originalDesign.canvas,
      elements: originalDesign.elements,
      previewImage: originalDesign.previewImage,
      isTemplate: false,
      metadata: originalDesign.metadata,
      version: 1,
    });

    return duplicatedDesign.save();
  }

  /**
   * Rename a design
   */
  async rename(designId: string, userId: string, newName: string): Promise<Design> {
    if (!Types.ObjectId.isValid(designId)) {
      throw new BadRequestException('Invalid design ID');
    }

    if (!newName || newName.trim().length === 0) {
      throw new BadRequestException('Design name cannot be empty');
    }

    const design = await this.designModel.findOne({
      _id: new Types.ObjectId(designId),
      userId: new Types.ObjectId(userId),
    });

    if (!design) {
      throw new NotFoundException('Design not found');
    }

    design.designName = newName.trim();
    return design.save();
  }

  /**
   * Get design statistics for a user
   */
  async getStats(userId: string): Promise<{
    totalDesigns: number;
    totalElements: number;
    lastModified: Date | null;
  }> {
    const designs = await this.designModel
      .find({ userId: new Types.ObjectId(userId), isActive: true })
      .lean()
      .exec();

    const totalElements = designs.reduce((sum, design) => sum + design.elements.length, 0);
    const lastModified = designs.length > 0 
      ? new Date(Math.max(...designs.map(d => new Date(d.updatedAt).getTime())))
      : null;

    return {
      totalDesigns: designs.length,
      totalElements,
      lastModified,
    };
  }

  /**
   * Sanitize design data to prevent XSS and injection attacks
   */
  private sanitizeDesignData(dto: CreateDesignDto | UpdateDesignDto): any {
    const sanitized = { ...dto };

    // Sanitize design name
    if (sanitized.designName) {
      sanitized.designName = sanitized.designName.trim().substring(0, 100);
    }

    // Sanitize elements
    if (sanitized.elements) {
      sanitized.elements = sanitized.elements.map((element) => {
        const sanitizedElement = { ...element };

        // Sanitize text content
        if (sanitizedElement.text) {
          sanitizedElement.text = sanitizedElement.text.substring(0, 1000);
        }

        // Sanitize image src (basic validation)
        if (sanitizedElement.src) {
          // Allow data URLs and http(s) URLs
          if (
            !sanitizedElement.src.startsWith('data:image/') &&
            !sanitizedElement.src.startsWith('http://') &&
            !sanitizedElement.src.startsWith('https://')
          ) {
            delete sanitizedElement.src;
          }
        }

        return sanitizedElement;
      });
    }

    return sanitized;
  }
}
