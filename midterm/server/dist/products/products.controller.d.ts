import { ProductsService } from './products.service.js';
import { QueryProductsDto } from './dto/query-products.dto.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(query: QueryProductsDto): Promise<import("./products.service.js").PaginatedProductsResponse>;
    getCategories(): Promise<import("./products.service.js").CategorySummary[]>;
    getFeatured(): Promise<import("../database/database.types.js").Product[]>;
    findOne(id: number): Promise<import("../database/database.types.js").Product>;
    getRelated(id: number): Promise<import("../database/database.types.js").Product[]>;
    create(createProductDto: CreateProductDto): Promise<import("../database/database.types.js").Product>;
    update(id: number, updateProductDto: UpdateProductDto): Promise<import("../database/database.types.js").Product>;
    remove(id: number): Promise<{
        success: boolean;
        id: number;
    }>;
}
