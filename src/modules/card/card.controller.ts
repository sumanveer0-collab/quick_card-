import {
  Controller, Post, Get, Put, Delete,
  Body, Param, Query, UseGuards, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserDocument } from '../user/schemas/user.schema';

@UseGuards(JwtAuthGuard)
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post('create')
  create(@Body() dto: CreateCardDto, @CurrentUser() user: UserDocument) {
    return this.cardService.create(dto, user);
  }

  @Put('update/:id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCardDto,
    @CurrentUser('_id') userId: string,
  ) {
    return this.cardService.update(id, dto, userId);
  }

  @Post('duplicate/:id')
  duplicate(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.cardService.duplicate(id, user);
  }

  @Get('list')
  list(
    @CurrentUser('_id') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.cardService.list(userId, page, Math.min(limit, 50));
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser('_id') userId: string) {
    return this.cardService.delete(id, userId);
  }

  @Post('print-ready')
  generatePrintReady(@Body('cardId') cardId: string, @CurrentUser() user: UserDocument) {
    return this.cardService.generatePrintReady(cardId, user);
  }

  @Get('job/:jobId')
  getJobStatus(@Param('jobId') jobId: string) {
    return this.cardService.getJobStatus(jobId);
  }
}
