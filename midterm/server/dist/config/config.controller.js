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
import { Controller, Get, Put, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuraConfigService } from './config.service.js';
let AuraConfigController = class AuraConfigController {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    getConfig() {
        return this.configService.getConfig();
    }
    updateConfig(body) {
        return this.configService.updateConfig(body);
    }
};
__decorate([
    Get(),
    ApiOperation({ summary: 'Получить настройки сайта (логотип, контакты, соцсети)' }),
    ApiResponse({ status: 200, description: 'Конфигурация сайта' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuraConfigController.prototype, "getConfig", null);
__decorate([
    Put(),
    ApiOperation({ summary: 'Обновить настройки сайта' }),
    ApiResponse({ status: 200, description: 'Конфигурация обновлена' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuraConfigController.prototype, "updateConfig", null);
AuraConfigController = __decorate([
    ApiTags('Конфигурация (Config)'),
    Controller('config'),
    __metadata("design:paramtypes", [AuraConfigService])
], AuraConfigController);
export { AuraConfigController };
//# sourceMappingURL=config.controller.js.map