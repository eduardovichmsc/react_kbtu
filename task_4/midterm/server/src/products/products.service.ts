import { Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class ProductsService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(query: QueryProductsDto): Promise<PaginatedProductsResponse> {
    const all = await this.db.getProducts();
    let result = [...all];

    // 1. Поиск (name, category, specs, description)
    if (query.search?.trim()) {
      const q = query.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.specs.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)),
      );
    }

    // 2. Фильтр по категории
    if (query.category && query.category !== 'Все') {
      result = result.filter((p) => p.category === query.category);
    }

    // 3. Только в наличии
    if (query.inStock === true) {
      result = result.filter((p) => p.inStock);
    }

    // 4. Сортировка
    if (query.sort === 'price-asc') {
      result.sort((a, b) => a.priceValue - b.priceValue);
    } else if (query.sort === 'price-desc') {
      result.sort((a, b) => b.priceValue - a.priceValue);
    } else if (query.sort === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    } else {
      // default: сначала featured, затем id
      result.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.id - b.id;
      });
    }

    const total = result.length;
    const limit = query.limit ?? 6;
    const page = query.page ?? 1;

    // Пагинация (если limit === 0, возвращаем всё)
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

  async getCategories(): Promise<CategorySummary[]> {
    const all = await this.db.getProducts();
    const map = new Map<string, number>();

    for (const p of all) {
      map.set(p.category, (map.get(p.category) || 0) + 1);
    }

    const categories: CategorySummary[] = [
      { name: 'Все', count: all.length },
      ...Array.from(map.entries()).map(([name, count]) => ({ name, count })),
    ];

    return categories;
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.db.getProductById(id);
    if (!product) {
      throw new NotFoundException(`Товар с ID ${id} не найден`);
    }
    return product;
  }

  async getFeatured(limit = 6): Promise<Product[]> {
    const all = await this.db.getProducts();
    return all.filter((p) => p.featured).slice(0, limit);
  }

  async getRelated(id: number, limit = 3): Promise<Product[]> {
    const product = await this.findOne(id);
    const all = await this.db.getProducts();
    return all
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, limit);
  }

  async create(dto: CreateProductDto): Promise<Product> {
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

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const updated = await this.db.updateProduct(id, dto);
    if (!updated) {
      throw new NotFoundException(`Товар с ID ${id} не найден`);
    }
    return updated;
  }

  async remove(id: number): Promise<{ success: boolean; id: number }> {
    const removed = await this.db.deleteProduct(id);
    if (!removed) {
      throw new NotFoundException(`Товар с ID ${id} не найден`);
    }
    return { success: true, id };
  }
}
