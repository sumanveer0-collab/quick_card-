import {
  IsString,
  IsNotEmpty,
  IsObject,
  IsArray,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsNumber,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

// Element DTOs
export enum ElementTypeDto {
  TEXT = 'text',
  IMAGE = 'image',
  SHAPE = 'shape',
  LOGO = 'logo',
  QR = 'qr',
}

export enum ShapeTypeDto {
  RECT = 'rect',
  CIRCLE = 'circle',
  LINE = 'line',
}

export class CanvasElementDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEnum(ElementTypeDto)
  type: ElementTypeDto;

  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsNumber()
  @Min(1)
  width: number;

  @IsNumber()
  @Min(1)
  height: number;

  @IsNumber()
  @Min(-360)
  @Max(360)
  rotation: number;

  // Text properties (optional)
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsNumber()
  @Min(8)
  @Max(200)
  fontSize?: number;

  @IsOptional()
  @IsString()
  fontFamily?: string;

  @IsOptional()
  @IsString()
  fontWeight?: string;

  @IsOptional()
  @IsString()
  fill?: string;

  @IsOptional()
  @IsString()
  stroke?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  strokeWidth?: number;

  @IsOptional()
  @IsString()
  align?: 'left' | 'center' | 'right' | 'justify';

  @IsOptional()
  @IsString()
  verticalAlign?: 'top' | 'middle' | 'bottom';

  @IsOptional()
  @IsNumber()
  letterSpacing?: number;

  @IsOptional()
  @IsNumber()
  lineHeight?: number;

  @IsOptional()
  @IsObject()
  padding?: { horizontal: number; vertical: number };

  // Image properties
  @IsOptional()
  @IsString()
  src?: string;

  // Shape properties
  @IsOptional()
  @IsEnum(ShapeTypeDto)
  shapeType?: ShapeTypeDto;

  @IsOptional()
  @IsNumber()
  cornerRadius?: number;

  // Layer properties
  @IsNumber()
  zIndex: number;

  @IsOptional()
  @IsBoolean()
  locked?: boolean;

  @IsOptional()
  @IsBoolean()
  visible?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  opacity?: number;
}

export class CanvasConfigDto {
  @IsNumber()
  @Min(100)
  @Max(5000)
  width: number;

  @IsNumber()
  @Min(100)
  @Max(5000)
  height: number;

  @IsString()
  @IsNotEmpty()
  background: string;

  @IsOptional()
  @IsBoolean()
  showGrid?: boolean;

  @IsOptional()
  @IsBoolean()
  showBleed?: boolean;

  @IsOptional()
  @IsBoolean()
  showTrim?: boolean;

  @IsOptional()
  @IsBoolean()
  showSafety?: boolean;
}

export class CreateDesignDto {
  @IsString()
  @IsNotEmpty()
  designName: string;

  @IsObject()
  @ValidateNested()
  @Type(() => CanvasConfigDto)
  canvas: CanvasConfigDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CanvasElementDto)
  elements: CanvasElementDto[];

  @IsOptional()
  @IsString()
  previewImage?: string;

  @IsOptional()
  @IsBoolean()
  isTemplate?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
