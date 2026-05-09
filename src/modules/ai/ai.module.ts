import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { UserModule } from '../user/user.module';
import { TemplateModule } from '../template/template.module';

@Module({
  imports: [ConfigModule, UserModule, TemplateModule],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
