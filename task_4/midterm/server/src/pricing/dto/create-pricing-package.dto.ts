import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class CreatePricingPackageDto {
  @ApiProperty({ example: 'Light' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '350k — 500k ₸' })
  @IsString()
  @IsNotEmpty()
  price: string;

  @ApiProperty({ example: 'Комплексное решение для фасада и витрин.' })
  @IsString()
  @IsNotEmpty()
  desc: string;

  @ApiProperty({ type: [String], example: ['Декор фасада', 'Световой занавес'] })
  @IsArray()
  @IsString({ each: true })
  features: string[];

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf' })
  @IsString()
  @IsNotEmpty()
  img: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;
}
