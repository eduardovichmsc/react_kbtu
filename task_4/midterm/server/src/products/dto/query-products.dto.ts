import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, IsIn, IsBoolean } from 'class-validator';

export class QueryProductsDto {
  @ApiPropertyOptional({ description: 'Поисковый запрос по названию, категории или описанию' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Фильтр по названию категории' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Показывать только товары в наличии' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  inStock?: boolean;

  @ApiPropertyOptional({
    description: 'Параметр сортировки',
    enum: ['default', 'price-asc', 'price-desc', 'name-asc'],
    default: 'default',
  })
  @IsOptional()
  @IsIn(['default', 'price-asc', 'price-desc', 'name-asc'])
  sort?: 'default' | 'price-asc' | 'price-desc' | 'name-asc' = 'default';

  @ApiPropertyOptional({ description: 'Номер страницы (1-based)', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Количество элементов на странице (0 для выгрузки всех)', default: 6 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  limit?: number = 6;
}
