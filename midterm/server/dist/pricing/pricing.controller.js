var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PricingService } from './pricing.service.js';
import { CreatePricingPackageDto } from './dto/create-pricing-package.dto.js';
let PricingController = class PricingController {
    pricingService;
    constructor(pricingService) {
        this.pricingService = pricingService;
    }
    findAll() {
        return this.pricingService.findAll();
    }
    findOne(id) {
        return this.pricingService.findOne(id);
    }
    create(createDto) {
        return this.pricingService.create(createDto);
    }
};
__decorate([
    Get(),
    ApiOperation({ summary: 'Получить список всех пакетов услуг оформления' }),
    ApiResponse({ status: 200, description: 'Список пакетов оформления' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PricingController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Получить пакет услуг по ID' }),
    ApiParam({ name: 'id', description: 'ID пакета', type: Number }),
    ApiResponse({ status: 200, description: 'Пакет найден' }),
    ApiResponse({ status: 404, description: 'Пакет не найден' }),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PricingController.prototype, "findOne", null);
__decorate([
    Post(),
    ApiOperation({ summary: 'Создать новый пакет услуг' }),
    ApiResponse({ status: 201, description: 'Пакет успешно создан' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreatePricingPackageDto]),
    __metadata("design:returntype", void 0)
], PricingController.prototype, "create", null);
PricingController = __decorate([
    ApiTags('Пакеты услуг (Pricing)'),
    Controller('pricing'),
    __metadata("design:paramtypes", [PricingService])
], PricingController);
export { PricingController };
//# sourceMappingURL=pricing.controller.js.map