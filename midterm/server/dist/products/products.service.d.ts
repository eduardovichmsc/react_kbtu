import { DatabaseService } from '../database/database.service.js';
import type { Product } from '../database/database.types.js';
import { QueryProductsDto } from './dto/query-products.dto.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
export interface PaginatedProductsResponse {
    items: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface CategorySummary {
    name: string;
    count: number;
}
export declare class ProductsService {
    private readonly db;
    constructor(db: DatabaseService);
    findAll(query: QueryProductsDto): Promise<PaginatedProductsResponse>;
    getCategories(): Promise<CategorySummary[]>;
    findOne(id: number): Promise<Product>;
    getFeatured(limit?: number): Promise<Product[]>;
    getRelated(id: number, limit?: number): Promise<Product[]>;
    create(dto: CreateProductDto): Promise<Product>;
    update(id: number, dto: UpdateProductDto): Promise<Product>;
    remove(id: number): Promise<{
        success: boolean;
        id: number;
    }>;
}
