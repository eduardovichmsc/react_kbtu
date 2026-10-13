import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import type {
  DatabaseSchema,
  Product,
  PricingPackage,
  ContactRequest,
  AppConfig,
} from './database.types.js';
import { initialDatabaseData } from './initial-seed.js';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly dbFilePath = path.resolve(process.cwd(), 'data', 'aura.db.json');
  private data: DatabaseSchema = { ...initialDatabaseData };
  private isLoaded = false;

  async onModuleInit() {
    await this.init();
  }

  private async init() {
    try {
      const dataDir = path.dirname(this.dbFilePath);
      await fs.mkdir(dataDir, { recursive: true });

      try {
        const fileContent = await fs.readFile(this.dbFilePath, 'utf-8');
        const parsed = JSON.parse(fileContent);
        this.data = {
          products: parsed.products ?? initialDatabaseData.products,
          pricingPackages: parsed.pricingPackages ?? initialDatabaseData.pricingPackages,
          contactRequests: parsed.contactRequests ?? initialDatabaseData.contactRequests,
          config: parsed.config ?? initialDatabaseData.config,
        };
        this.logger.log(`Database loaded successfully from ${this.dbFilePath}`);
      } catch {
        // File does not exist yet or is invalid, seed with initial data
        this.data = { ...initialDatabaseData };
        await this.persist();
        this.logger.log(`Initialized and seeded fresh database at ${this.dbFilePath}`);
      }
      this.isLoaded = true;
    } catch (err) {
      this.logger.error('Failed to initialize database file', err);
    }
  }

  private async persist() {
    try {
      await fs.writeFile(this.dbFilePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      this.logger.error('Failed to write database file', err);
    }
  }

  // --- Products ---
  async getProducts(): Promise<Product[]> {
    return [...this.data.products];
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.data.products.find((p) => p.id === id);
  }

  async createProduct(item: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const nextId = this.data.products.length > 0 ? Math.max(...this.data.products.map((p) => p.id)) + 1 : 1;
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...item,
      id: nextId,
      createdAt: now,
      updatedAt: now,
    };
    this.data.products.push(newProduct);
    await this.persist();
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product | undefined> {
    const index = this.data.products.findIndex((p) => p.id === id);
    if (index === -1) return undefined;
    this.data.products[index] = {
      ...this.data.products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await this.persist();
    return this.data.products[index];
  }

  async deleteProduct(id: number): Promise<boolean> {
    const prevLen = this.data.products.length;
    this.data.products = this.data.products.filter((p) => p.id !== id);
    if (this.data.products.length !== prevLen) {
      await this.persist();
      return true;
    }
    return false;
  }

  // --- Pricing Packages ---
  async getPricingPackages(): Promise<PricingPackage[]> {
    return [...this.data.pricingPackages];
  }

  async getPricingPackageById(id: number): Promise<PricingPackage | undefined> {
    return this.data.pricingPackages.find((p) => p.id === id);
  }

  async createPricingPackage(item: Omit<PricingPackage, 'id'>): Promise<PricingPackage> {
    const nextId =
      this.data.pricingPackages.length > 0
        ? Math.max(...this.data.pricingPackages.map((p) => p.id)) + 1
        : 1;
    const newPkg: PricingPackage = { ...item, id: nextId };
    this.data.pricingPackages.push(newPkg);
    await this.persist();
    return newPkg;
  }

  // --- Contact Requests / Orders ---
  async getContactRequests(): Promise<ContactRequest[]> {
    return [...this.data.contactRequests];
  }

  async createContactRequest(
    req: Omit<ContactRequest, 'id' | 'createdAt' | 'status'>,
  ): Promise<ContactRequest> {
    const nextId =
      this.data.contactRequests.length > 0
        ? Math.max(...this.data.contactRequests.map((r) => r.id)) + 1
        : 1;
    const newReq: ContactRequest = {
      ...req,
      id: nextId,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    this.data.contactRequests.unshift(newReq);
    await this.persist();
    return newReq;
  }

  async updateContactRequestStatus(
    id: number,
    status: 'PENDING' | 'CONTACTED' | 'COMPLETED',
  ): Promise<ContactRequest | undefined> {
    const req = this.data.contactRequests.find((r) => r.id === id);
    if (!req) return undefined;
    req.status = status;
    await this.persist();
    return req;
  }

  // --- App Config ---
  async getConfig(): Promise<AppConfig> {
    return { ...this.data.config };
  }

  async updateConfig(newConfig: Partial<AppConfig>): Promise<AppConfig> {
    this.data.config = { ...this.data.config, ...newConfig };
    await this.persist();
    return this.data.config;
  }
}
