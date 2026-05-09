import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class GenerateAiDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  businessType: string;
}
