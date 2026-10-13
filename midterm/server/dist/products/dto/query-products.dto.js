var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, IsIn, IsBoolean } from 'class-validator';
export class QueryProductsDto {
    search;
    category;
    inStock;
    sort = 'default';
    page = 1;
    limit = 6;
}
__decorate([
    ApiPropertyOptional({ description: 'Поисковый запрос по названию, категории или описанию' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], QueryProductsDto.prototype, "search", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Фильтр по названию категории' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], QueryProductsDto.prototype, "category", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Показывать только товары в наличии' }),
    IsOptional(),
    Transform(({ value }) => value === 'true' || value === true),
    IsBoolean(),
    __metadata("design:type", Boolean)
], QueryProductsDto.prototype, "inStock", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Параметр сортировки',
        enum: ['default', 'price-asc', 'price-desc', 'name-asc'],
        default: 'default',
    }),
    IsOptional(),
    IsIn(['default', 'price-asc', 'price-desc', 'name-asc']),
    __metadata("design:type", String)
], QueryProductsDto.prototype, "sort", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Номер страницы (1-based)', default: 1 }),
    IsOptional(),
    Type(() => Number),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], QueryProductsDto.prototype, "page", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Количество элементов на странице (0 для выгрузки всех)', default: 6 }),
    IsOptional(),
    Type(() => Number),
    IsInt(),
    Min(0),
    __metadata("design:type", Number)
], QueryProductsDto.prototype, "limit", void 0);
//# sourceMappingURL=query-products.dto.js.map