import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PricingService } from './pricing.service.js';
import { CreatePricingPackageDto } from './dto/create-pricing-package.dto.js';

@ApiTags('Пакеты услуг (Pricing)')
@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список всех пакетов услуг оформления' })
  @ApiResponse({ status: 200, description: 'Список пакетов оформления' })
  findAll() {
    return this.pricingService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить пакет услуг по ID' })
  @ApiParam({ name: 'id', description: 'ID пакета', type: Number })
  @ApiResponse({ status: 200, description: 'Пакет найден' })
  @ApiResponse({ status: 404, description: 'Пакет не найден' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pricingService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать новый пакет услуг' })
  @ApiResponse({ status: 201, description: 'Пакет успешно создан' })
  create(@Body() createDto: CreatePricingPackageDto) {
    return this.pricingService.create(createDto);
  }
}
