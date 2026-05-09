import { Controller, Get } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';

@Controller('health')
export class HealthController {
  @Public()
  @Get()
  check() {
    return {
      message: 'QuickCard API is healthy',
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        app: 'QuickCard – Your Business Card Mitra',
      },
    };
  }
}
