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
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DesignService } from './design.service';
import { CreateDesignDto } from './dto/create-design.dto';
import { UpdateDesignDto } from './dto/update-design.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('designs')
export class DesignController {
  constructor(private readonly designService: DesignService) {}

  /**
   * POST /api/v1/designs
   * Create a new design
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() createDesignDto: CreateDesignDto) {
    const userId = req.user.userId;
    return this.designService.create(userId, createDesignDto);
  }

  /**
   * GET /api/v1/designs
   * Get all designs for the authenticated user
   */
  @Get()
  async findAll(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    const userId = req.user.userId;
    return this.designService.findAllByUser(userId, page, limit);
  }

  /**
   * GET /api/v1/designs/stats
   * Get design statistics for the user
   */
  @Get('stats')
  async getStats(@Request() req) {
    const userId = req.user.userId;
    return this.designService.getStats(userId);
  }

  /**
   * GET /api/v1/designs/:id
   * Get a single design by ID
   */
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.designService.findOne(id, userId);
  }

  /**
   * PUT /api/v1/designs/:id
   * Update a design
   */
  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDesignDto: UpdateDesignDto,
  ) {
    const userId = req.user.userId;
    return this.designService.update(id, userId, updateDesignDto);
  }

  /**
   * DELETE /api/v1/designs/:id
   * Delete a design (soft delete)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Request() req, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.designService.remove(id, userId);
  }

  /**
   * POST /api/v1/designs/:id/duplicate
   * Duplicate a design
   */
  @Post(':id/duplicate')
  @HttpCode(HttpStatus.CREATED)
  async duplicate(@Request() req, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.designService.duplicate(id, userId);
  }

  /**
   * PUT /api/v1/designs/:id/rename
   * Rename a design
   */
  @Put(':id/rename')
  async rename(
    @Request() req,
    @Param('id') id: string,
    @Body('designName') designName: string,
  ) {
    const userId = req.user.userId;
    return this.designService.rename(id, userId, designName);
  }
}
