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
let PricingService = class PricingService {
    db;
    constructor(db) {
        this.db = db;
    }
    async findAll() {
        return this.db.getPricingPackages();
    }
    async findOne(id) {
        const pkg = await this.db.getPricingPackageById(id);
        if (!pkg) {
            throw new NotFoundException(`Пакет услуг с ID ${id} не найден`);
        }
        return pkg;
    }
    async create(dto) {
        return this.db.createPricingPackage({
            name: dto.name,
            price: dto.price,
            desc: dto.desc,
            features: dto.features,
            img: dto.img,
            isPopular: dto.isPopular ?? false,
        });
    }
};
PricingService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [DatabaseService])
], PricingService);
export { PricingService };
//# sourceMappingURL=pricing.service.js.map