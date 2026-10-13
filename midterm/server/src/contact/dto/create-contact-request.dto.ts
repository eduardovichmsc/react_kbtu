import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsIn, IsNumber } from 'class-validator';

export class CreateContactRequestDto {
  @ApiProperty({
    enum: ['QUOTE', 'CONSULTATION', 'ORDER'],
    example: 'QUOTE',
    description: 'Тип заявки: расчет сметы (QUOTE), консультация (CONSULTATION) или заказ товара (ORDER)',
  })
  @IsIn(['QUOTE', 'CONSULTATION', 'ORDER'])
  type: 'QUOTE' | 'CONSULTATION' | 'ORDER';

  @ApiPropertyOptional({ example: 'Алихан' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '+7 701 555 12 34' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'client@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ example: 'Интересует расчет декора летней террасы кофейни' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  productId?: number;

  @ApiPropertyOptional({ example: 'Nomad Lamp' })
  @IsOptional()
  @IsString()
  productName?: string;

  @ApiPropertyOptional({ example: 'Light' })
  @IsOptional()
  @IsString()
  packageName?: string;
}
