import {
  IsString, IsNotEmpty, IsEmail, IsOptional,
  IsBoolean, IsMongoId, IsEnum, IsArray,
  IsObject, MaxLength, IsUrl,
} from 'class-validator';

class SocialLinksDto {
  @IsOptional() @IsString() instagram?: string;
  @IsOptional() @IsString() facebook?: string;
  @IsOptional() @IsString() twitter?: string;
  @IsOptional() @IsString() linkedin?: string;
  @IsOptional() @IsString() youtube?: string;
  @IsOptional() @IsString() whatsapp?: string;
}

export class CreateCardDto {
  @IsNotEmpty() @IsString() @MaxLength(100) name: string;
  @IsNotEmpty() @IsString() @MaxLength(150) businessName: string;
  @IsNotEmpty() @IsString() @MaxLength(20) phone: string;
  @IsNotEmpty() @IsEmail() email: string;

  @IsOptional() @IsString() @MaxLength(300) address?: string;
  @IsOptional() @IsString() @MaxLength(200) website?: string;
  @IsOptional() socialLinks?: SocialLinksDto;
  @IsOptional() @IsString() logoUrl?: string;

  @IsNotEmpty() @IsMongoId() templateId: string;

  @IsOptional() @IsBoolean() qrEnabled?: boolean;
  @IsOptional() @IsEnum(['light', 'dark']) themeMode?: string;
  @IsOptional() @IsString() @MaxLength(200) tagline?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) services?: string[];
  @IsOptional() @IsObject() colorTheme?: Record<string, string>;
}
