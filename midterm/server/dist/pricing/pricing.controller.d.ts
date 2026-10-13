import { PricingService } from './pricing.service.js';
import { CreatePricingPackageDto } from './dto/create-pricing-package.dto.js';
export declare class PricingController {
    private readonly pricingService;
    constructor(pricingService: PricingService);
    findAll(): Promise<import("../database/database.types.js").PricingPackage[]>;
    findOne(id: number): Promise<import("../database/database.types.js").PricingPackage>;
    create(createDto: CreatePricingPackageDto): Promise<import("../database/database.types.js").PricingPackage>;
}
