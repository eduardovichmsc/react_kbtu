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
let ProductsService = class ProductsService {
    db;
    constructor(db) {
        this.db = db;
    }
    async findAll(query) {
        const all = await this.db.getProducts();
        let result = [...all];
        if (query.search?.trim()) {
            const q = query.search.toLowerCase().trim();
            result = result.filter((p) => p.name.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q) ||
                p.specs.toLowerCase().includes(q) ||
                (p.description && p.description.toLowerCase().includes(q)));
        }
        if (query.category && query.category !== 'Все') {
            result = result.filter((p) => p.category === query.category);
        }
        if (query.inStock === true) {
            result = result.filter((p) => p.inStock);
        }
        if (query.sort === 'price-asc') {
            result.sort((a, b) => a.priceValue - b.priceValue);
        }
        else if (query.sort === 'price-desc') {
            result.sort((a, b) => b.priceValue - a.priceValue);
        }
        else if (query.sort === 'name-asc') {
            result.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
        }
        else {
            result.sort((a, b) => {
                if (a.featured && !b.featured)
                    return -1;
                if (!a.featured && b.featured)
                    return 1;
                return a.id - b.id;
            });
        }
        const total = result.length;
        const limit = query.limit ?? 6;
        const page = query.page ?? 1;
        if (limit > 0) {
            const startIndex = (page - 1) * limit;
            result = result.slice(startIndex, startIndex + limit);
        }
        const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;
        return {
            items: result,
            total,
            page,
            limit,
            totalPages,
        };
    }
    async getCategories() {
        const all = await this.db.getProducts();
        const map = new Map();
        for (const p of all) {
            map.set(p.category, (map.get(p.category) || 0) + 1);
        }
        const categories = [
            { name: 'Все', count: all.length },
            ...Array.from(map.entries()).map(([name, count]) => ({ name, count })),
        ];
        return categories;
    }
    async findOne(id) {
        const product = await this.db.getProductById(id);
        if (!product) {
            throw new NotFoundException(`Товар с ID ${id} не найден`);
        }
        return product;
    }
    async getFeatured(limit = 6) {
        const all = await this.db.getProducts();
        return all.filter((p) => p.featured).slice(0, limit);
    }
    async getRelated(id, limit = 3) {
        const product = await this.findOne(id);
        const all = await this.db.getProducts();
        return all
            .filter((p) => p.id !== product.id && p.category === product.category)
            .slice(0, limit);
    }
    async create(dto) {
        return this.db.createProduct({
            name: dto.name,
            price: dto.price,
            priceValue: dto.priceValue,
            category: dto.category,
            specs: dto.specs,
            img: dto.img,
            gallery: dto.gallery ?? [dto.img],
            description: dto.description ?? '',
            dimensions: dto.dimensions,
            materials: dto.materials,
            origin: dto.origin,
            features: dto.features ?? [],
            inStock: dto.inStock ?? true,
            featured: dto.featured ?? false,
        });
    }
    async update(id, dto) {
        const updated = await this.db.updateProduct(id, dto);
        if (!updated) {
            throw new NotFoundException(`Товар с ID ${id} не найден`);
        }
        return updated;
    }
    async remove(id) {
        const removed = await this.db.deleteProduct(id);
        if (!removed) {
            throw new NotFoundException(`Товар с ID ${id} не найден`);
        }
        return { success: true, id };
    }
};
ProductsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [DatabaseService])
], ProductsService);
export { ProductsService };
//# sourceMappingURL=products.service.js.map