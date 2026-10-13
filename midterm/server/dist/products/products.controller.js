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
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProductsService } from './products.service.js';
import { QueryProductsDto } from './dto/query-products.dto.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
let ProductsController = class ProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    findAll(query) {
        return this.productsService.findAll(query);
    }
    getCategories() {
        return this.productsService.getCategories();
    }
    getFeatured() {
        return this.productsService.getFeatured();
    }
    findOne(id) {
        return this.productsService.findOne(id);
    }
    getRelated(id) {
        return this.productsService.getRelated(id);
    }
    create(createProductDto) {
        return this.productsService.create(createProductDto);
    }
    update(id, updateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }
    remove(id) {
        return this.productsService.remove(id);
    }
};
__decorate([
    Get(),
    ApiOperation({
        summary: 'Получить список товаров с фильтрацией, сортировкой и пагинацией',
    }),
    ApiResponse({ status: 200, description: 'Список товаров успешно получен' }),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QueryProductsDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAll", null);
__decorate([
    Get('categories'),
    ApiOperation({
        summary: 'Получить список категорий с количеством товаров в каждой',
    }),
    ApiResponse({ status: 200, description: 'Список категорий с подсчетом товаров' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getCategories", null);
__decorate([
    Get('featured'),
    ApiOperation({ summary: 'Получить избранные / рекомендуемые товары для главной страницы' }),
    ApiResponse({ status: 200, description: 'Список избранных товаров' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getFeatured", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Получить детальную информацию о товаре по его ID' }),
    ApiParam({ name: 'id', description: 'ID товара', type: Number }),
    ApiResponse({ status: 200, description: 'Товар найден' }),
    ApiResponse({ status: 404, description: 'Товар не найден' }),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findOne", null);
__decorate([
    Get(':id/related'),
    ApiOperation({ summary: 'Получить похожие товары из той же категории' }),
    ApiParam({ name: 'id', description: 'ID товара', type: Number }),
    ApiResponse({ status: 200, description: 'Список похожих товаров' }),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getRelated", null);
__decorate([
    Post(),
    ApiOperation({ summary: 'Создать новый товар' }),
    ApiResponse({ status: 201, description: 'Товар успешно создан' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "create", null);
__decorate([
    Patch(':id'),
    ApiOperation({ summary: 'Обновить существующий товар по ID' }),
    ApiParam({ name: 'id', description: 'ID товара', type: Number }),
    ApiResponse({ status: 200, description: 'Товар успешно обновлен' }),
    ApiResponse({ status: 404, description: 'Товар не найден' }),
    __param(0, Param('id', ParseIntPipe)),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UpdateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "update", null);
__decorate([
    Delete(':id'),
    ApiOperation({ summary: 'Удалить товар по ID' }),
    ApiParam({ name: 'id', description: 'ID товара', type: Number }),
    ApiResponse({ status: 200, description: 'Товар успешно удален' }),
    ApiResponse({ status: 404, description: 'Товар не найден' }),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "remove", null);
ProductsController = __decorate([
    ApiTags('Товары (Products)'),
    Controller('products'),
    __metadata("design:paramtypes", [ProductsService])
], ProductsController);
export { ProductsController };
//# sourceMappingURL=products.controller.js.map