import { DatabaseService } from '../database/database.service.js';
import type { PricingPackage } from '../database/database.types.js';
import { CreatePricingPackageDto } from './dto/create-pricing-package.dto.js';
export declare class PricingService {
    private readonly db;
    constructor(db: DatabaseService);
    findAll(): Promise<PricingPackage[]>;
    findOne(id: number): Promise<PricingPackage>;
    create(dto: CreatePricingPackageDto): Promise<PricingPackage>;
}
