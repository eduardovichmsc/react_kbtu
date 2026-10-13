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
import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ContactService } from './contact.service.js';
import { CreateContactRequestDto } from './dto/create-contact-request.dto.js';
let ContactController = class ContactController {
    contactService;
    constructor(contactService) {
        this.contactService = contactService;
    }
    findAll() {
        return this.contactService.findAll();
    }
    create(dto) {
        return this.contactService.create(dto);
    }
    updateStatus(id, status) {
        return this.contactService.updateStatus(id, status);
    }
};
__decorate([
    Get(),
    ApiOperation({ summary: 'Получить список всех полученных заявок' }),
    ApiResponse({ status: 200, description: 'Список заявок' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "findAll", null);
__decorate([
    Post(),
    ApiOperation({ summary: 'Отправить новую заявку на расчет сметы, консультацию или покупку товара' }),
    ApiResponse({ status: 201, description: 'Заявка успешно зарегистрирована' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateContactRequestDto]),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "create", null);
__decorate([
    Patch(':id/status'),
    ApiOperation({ summary: 'Обновить статус заявки (PENDING, CONTACTED, COMPLETED)' }),
    ApiParam({ name: 'id', description: 'ID заявки', type: Number }),
    ApiBody({
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', enum: ['PENDING', 'CONTACTED', 'COMPLETED'] },
            },
        },
    }),
    __param(0, Param('id', ParseIntPipe)),
    __param(1, Body('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "updateStatus", null);
ContactController = __decorate([
    ApiTags('Заявки и контакты (Contact & Orders)'),
    Controller('contact'),
    __metadata("design:paramtypes", [ContactService])
], ContactController);
export { ContactController };
//# sourceMappingURL=contact.controller.js.map