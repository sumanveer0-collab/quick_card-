import { PartialType } from '@nestjs/mapped-types';
import { CreateDesignDto } from './create-design.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateDesignDto extends PartialType(CreateDesignDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
