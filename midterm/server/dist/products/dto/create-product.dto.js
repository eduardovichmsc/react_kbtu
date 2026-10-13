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
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsArray } from 'class-validator';
export class CreateProductDto {
    name;
    price;
    priceValue;
    category;
    specs;
    img;
    gallery;
    description;
    dimensions;
    materials;
    origin;
    features;
    inStock = true;
    featured = false;
}
__decorate([
    ApiProperty({ example: 'Nomad Lamp' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "name", void 0);
__decorate([
    ApiProperty({ example: '18 500 ₸' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "price", void 0);
__decorate([
    ApiProperty({ example: 18500 }),
    IsNumber(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "priceValue", void 0);
__decorate([
    ApiProperty({ example: 'Свет' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "category", void 0);
__decorate([
    ApiProperty({ example: 'Wireless / 12h' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "specs", void 0);
__decorate([
    ApiProperty({ example: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "img", void 0);
__decorate([
    ApiPropertyOptional({ type: [String], example: ['https://images.unsplash.com/photo-1534353436294-0dbd4bdac845'] }),
    IsOptional(),
    IsArray(),
    IsString({ each: true }),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "gallery", void 0);
__decorate([
    ApiPropertyOptional({ example: 'Портативная беспроводная лампа с мягким теплым рассеянным светом.' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    ApiPropertyOptional({ example: 'H: 26 см, D основания: 11 см' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "dimensions", void 0);
__decorate([
    ApiPropertyOptional({ example: 'Анодированный алюминий, матовое стекло' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "materials", void 0);
__decorate([
    ApiPropertyOptional({ example: 'Дания / Ручная сборка' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "origin", void 0);
__decorate([
    ApiPropertyOptional({ type: [String], example: ['До 12 часов автономной работы'] }),
    IsOptional(),
    IsArray(),
    IsString({ each: true }),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "features", void 0);
__decorate([
    ApiPropertyOptional({ default: true }),
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], CreateProductDto.prototype, "inStock", void 0);
__decorate([
    ApiPropertyOptional({ default: false }),
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], CreateProductDto.prototype, "featured", void 0);
//# sourceMappingURL=create-product.dto.js.map