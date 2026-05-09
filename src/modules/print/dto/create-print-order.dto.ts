import {
  IsMongoId,
  IsNotEmpty,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsObject,
  IsString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaperType, FinishType } from '../schemas/print-order.schema';

class AddressDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  line1: string;

  @IsOptional()
  @IsString()
  line2?: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  pincode: string;
}

export class CreatePrintOrderDto {
  @IsNotEmpty()
  @IsMongoId()
  cardId: string;

  @IsNotEmpty()
  @IsInt()
  @Min(50)
  @Max(1000)
  quantity: number;

  @IsNotEmpty()
  @IsEnum(PaperType)
  paperType: PaperType;

  @IsNotEmpty()
  @IsEnum(FinishType)
  finish: FinishType;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
