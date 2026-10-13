var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
let ContactService = class ContactService {
    db;
    constructor(db) {
        this.db = db;
    }
    async findAll() {
        return this.db.getContactRequests();
    }
    async create(dto) {
        return this.db.createContactRequest({
            type: dto.type,
            name: dto.name,
            phone: dto.phone,
            email: dto.email,
            message: dto.message,
            productId: dto.productId,
            productName: dto.productName,
            packageName: dto.packageName,
        });
    }
    async updateStatus(id, status) {
        const updated = await this.db.updateContactRequestStatus(id, status);
        if (!updated) {
            throw new NotFoundException(`Заявка с ID ${id} не найдена`);
        }
        return updated;
    }
};
ContactService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [DatabaseService])
], ContactService);
export { ContactService };
//# sourceMappingURL=contact.service.js.map