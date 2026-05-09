import {
  Controller, Get, Post, Body, Query, Param,
  UseGuards, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { TemplateCategory } from './schemas/template.schema';
import { CreateTemplateDto } from './dto/create-template.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { IsEnum, IsOptional, IsNumberString } from 'class-validator';

class TemplateQueryDto {
  @IsOptional() @IsEnum(TemplateCategory) category?: TemplateCategory;
  @IsOptional() @IsNumberString() page?: string;
  @IsOptional() @IsNumberString() limit?: string;
}

@UseGuards(JwtAuthGuard)
@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  // GET /templates — list all (public)
  @Public()
  @Get()
  findAll(
    @Query() query: TemplateQueryDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.templateService.findAll(query.category, page, limit);
  }

  // GET /templates/:id — single template (public)
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.templateService.findByIdPublic(id);
  }

  // POST /templates — create (admin)
  @Post()
  create(@Body() dto: CreateTemplateDto) {
    return this.templateService.create(dto);
  }
}
