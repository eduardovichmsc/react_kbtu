var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsOptional, IsBoolean } from 'class-validator';
export class CreatePricingPackageDto {
    name;
    price;
    desc;
    features;
    img;
    isPopular;
}
__decorate([
    ApiProperty({ example: 'Light' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreatePricingPackageDto.prototype, "name", void 0);
__decorate([
    ApiProperty({ example: '350k — 500k ₸' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreatePricingPackageDto.prototype, "price", void 0);
__decorate([
    ApiProperty({ example: 'Комплексное решение для фасада и витрин.' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreatePricingPackageDto.prototype, "desc", void 0);
__decorate([
    ApiProperty({ type: [String], example: ['Декор фасада', 'Световой занавес'] }),
    IsArray(),
    IsString({ each: true }),
    __metadata("design:type", Array)
], CreatePricingPackageDto.prototype, "features", void 0);
__decorate([
    ApiProperty({ example: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreatePricingPackageDto.prototype, "img", void 0);
__decorate([
    ApiPropertyOptional({ default: false }),
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], CreatePricingPackageDto.prototype, "isPopular", void 0);
//# sourceMappingURL=create-pricing-package.dto.js.map