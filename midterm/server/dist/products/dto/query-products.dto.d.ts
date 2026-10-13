export declare class QueryProductsDto {
    search?: string;
    category?: string;
    inStock?: boolean;
    sort?: 'default' | 'price-asc' | 'price-desc' | 'name-asc';
    page?: number;
    limit?: number;
}
