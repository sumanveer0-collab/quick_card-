import { IsString, IsObject, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreateBusinessCardDto {
  @IsString()
  templateId: string;

  @IsString()
  title: string;

  @IsObject()
  front: any;

  @IsObject()
  back: any;

  @IsObject()
  metadata: any;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  thumbnail?: string;
}
