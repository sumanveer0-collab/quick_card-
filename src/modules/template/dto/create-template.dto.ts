import { IsString, IsEnum, IsBoolean, IsObject, IsOptional, IsNotEmpty } from 'class-validator';
import { TemplateCategory } from '../schemas/template.schema';

export class CreateTemplateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(TemplateCategory)
  category: TemplateCategory;

  @IsNotEmpty()
  @IsString()
  previewImage: string;

  @IsOptional()
  @IsBoolean()
  isPremium?: boolean;

  @IsNotEmpty()
  @IsObject()
  layoutConfig: Record<string, any>;
}
