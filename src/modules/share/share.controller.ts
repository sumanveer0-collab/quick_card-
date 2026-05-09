import { Controller, Get, Param } from '@nestjs/common';
import { ShareService } from './share.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller('c')
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @Public()
  @Get(':slug')
  getPublicCard(@Param('slug') slug: string) {
    return this.shareService.getPublicCard(slug);
  }
}
