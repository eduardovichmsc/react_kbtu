import { Controller, Get, Put, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuraConfigService } from './config.service.js';
import type { AppConfig } from '../database/database.types.js';

@ApiTags('Конфигурация (Config)')
@Controller('config')
export class AuraConfigController {
  constructor(private readonly configService: AuraConfigService) {}

  @Get()
  @ApiOperation({ summary: 'Получить настройки сайта (логотип, контакты, соцсети)' })
  @ApiResponse({ status: 200, description: 'Конфигурация сайта' })
  getConfig() {
    return this.configService.getConfig();
  }

  @Put()
  @ApiOperation({ summary: 'Обновить настройки сайта' })
  @ApiResponse({ status: 200, description: 'Конфигурация обновлена' })
  updateConfig(@Body() body: Partial<AppConfig>) {
    return this.configService.updateConfig(body);
  }
}
