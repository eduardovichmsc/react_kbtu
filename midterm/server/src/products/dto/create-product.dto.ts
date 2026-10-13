import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Nomad Lamp' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '18 500 ₸' })
  @IsString()
  @IsNotEmpty()
  price: string;

  @ApiProperty({ example: 18500 })
  @IsNumber()
  priceValue: number;

  @ApiProperty({ example: 'Свет' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'Wireless / 12h' })
  @IsString()
  @IsNotEmpty()
  specs: string;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845' })
  @IsString()
  @IsNotEmpty()
  img: string;

  @ApiPropertyOptional({ type: [String], example: ['https://images.unsplash.com/photo-1534353436294-0dbd4bdac845'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery?: string[];

  @ApiPropertyOptional({ example: 'Портативная беспроводная лампа с мягким теплым рассеянным светом.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'H: 26 см, D основания: 11 см' })
  @IsOptional()
  @IsString()
  dimensions?: string;

  @ApiPropertyOptional({ example: 'Анодированный алюминий, матовое стекло' })
  @IsOptional()
  @IsString()
  materials?: string;

  @ApiPropertyOptional({ example: 'Дания / Ручная сборка' })
  @IsOptional()
  @IsString()
  origin?: string;

  @ApiPropertyOptional({ type: [String], example: ['До 12 часов автономной работы'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  inStock?: boolean = true;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean = false;
}
