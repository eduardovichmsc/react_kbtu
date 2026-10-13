import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import type { PricingPackage } from '../database/database.types.js';
import { CreatePricingPackageDto } from './dto/create-pricing-package.dto.js';

@Injectable()
export class PricingService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(): Promise<PricingPackage[]> {
    return this.db.getPricingPackages();
  }

  async findOne(id: number): Promise<PricingPackage> {
    const pkg = await this.db.getPricingPackageById(id);
    if (!pkg) {
      throw new NotFoundException(`Пакет услуг с ID ${id} не найден`);
    }
    return pkg;
  }

  async create(dto: CreatePricingPackageDto): Promise<PricingPackage> {
    return this.db.createPricingPackage({
      name: dto.name,
      price: dto.price,
      desc: dto.desc,
      features: dto.features,
      img: dto.img,
      isPopular: dto.isPopular ?? false,
    });
  }
}
