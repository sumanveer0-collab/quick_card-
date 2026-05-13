import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BusinessCardService } from './business-card.service';
import { CreateBusinessCardDto } from './dto/create-business-card.dto';
import { UpdateBusinessCardDto } from './dto/update-business-card.dto';

@Controller('business-cards')
export class BusinessCardController {
  constructor(private readonly businessCardService: BusinessCardService) {}

  @Post()
  async create(
    @Request() req,
    @Body() createDto: CreateBusinessCardDto,
  ) {
    const userId = req.user?.userId || 'anonymous';
    return this.businessCardService.create(userId, createDto);
  }

  @Get()
  async findAll(@Request() req) {
    const userId = req.user?.userId || 'anonymous';
    return this.businessCardService.findAll(userId);
  }

  @Get('public')
  async findPublic(@Query('limit') limit?: number) {
    return this.businessCardService.findPublic(limit);
  }

  @Get('template/:templateId')
  async findByTemplate(@Param('templateId') templateId: string) {
    return this.businessCardService.findByTemplate(templateId);
  }

  @Get('search')
  async searchByTags(@Query('tags') tags: string) {
    const tagArray = tags.split(',').map(tag => tag.trim());
    return this.businessCardService.searchByTags(tagArray);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user?.userId || 'anonymous';
    await this.businessCardService.incrementViews(id);
    return this.businessCardService.findOne(id, userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateDto: UpdateBusinessCardDto,
  ) {
    const userId = req.user?.userId || 'anonymous';
    return this.businessCardService.update(id, userId, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const userId = req.user?.userId || 'anonymous';
    await this.businessCardService.delete(id, userId);
    return { message: 'Business card deleted successfully' };
  }

  @Post(':id/download')
  async trackDownload(@Param('id') id: string) {
    await this.businessCardService.incrementDownloads(id);
    return { message: 'Download tracked' };
  }
}
