var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DatabaseService_1;
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { initialDatabaseData } from './initial-seed.js';
let DatabaseService = DatabaseService_1 = class DatabaseService {
    logger = new Logger(DatabaseService_1.name);
    dbFilePath = path.resolve(process.cwd(), 'data', 'aura.db.json');
    data = { ...initialDatabaseData };
    isLoaded = false;
    async onModuleInit() {
        await this.init();
    }
    async init() {
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
            }
            catch {
                this.data = { ...initialDatabaseData };
                await this.persist();
                this.logger.log(`Initialized and seeded fresh database at ${this.dbFilePath}`);
            }
            this.isLoaded = true;
        }
        catch (err) {
            this.logger.error('Failed to initialize database file', err);
        }
    }
    async persist() {
        try {
            await fs.writeFile(this.dbFilePath, JSON.stringify(this.data, null, 2), 'utf-8');
        }
        catch (err) {
            this.logger.error('Failed to write database file', err);
        }
    }
    async getProducts() {
        return [...this.data.products];
    }
    async getProductById(id) {
        return this.data.products.find((p) => p.id === id);
    }
    async createProduct(item) {
        const nextId = this.data.products.length > 0 ? Math.max(...this.data.products.map((p) => p.id)) + 1 : 1;
        const now = new Date().toISOString();
        const newProduct = {
            ...item,
            id: nextId,
            createdAt: now,
            updatedAt: now,
        };
        this.data.products.push(newProduct);
        await this.persist();
        return newProduct;
    }
    async updateProduct(id, updates) {
        const index = this.data.products.findIndex((p) => p.id === id);
        if (index === -1)
            return undefined;
        this.data.products[index] = {
            ...this.data.products[index],
            ...updates,
            updatedAt: new Date().toISOString(),
        };
        await this.persist();
        return this.data.products[index];
    }
    async deleteProduct(id) {
        const prevLen = this.data.products.length;
        this.data.products = this.data.products.filter((p) => p.id !== id);
        if (this.data.products.length !== prevLen) {
            await this.persist();
            return true;
        }
        return false;
    }
    async getPricingPackages() {
        return [...this.data.pricingPackages];
    }
    async getPricingPackageById(id) {
        return this.data.pricingPackages.find((p) => p.id === id);
    }
    async createPricingPackage(item) {
        const nextId = this.data.pricingPackages.length > 0
            ? Math.max(...this.data.pricingPackages.map((p) => p.id)) + 1
            : 1;
        const newPkg = { ...item, id: nextId };
        this.data.pricingPackages.push(newPkg);
        await this.persist();
        return newPkg;
    }
    async getContactRequests() {
        return [...this.data.contactRequests];
    }
    async createContactRequest(req) {
        const nextId = this.data.contactRequests.length > 0
            ? Math.max(...this.data.contactRequests.map((r) => r.id)) + 1
            : 1;
        const newReq = {
            ...req,
            id: nextId,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
        };
        this.data.contactRequests.unshift(newReq);
        await this.persist();
        return newReq;
    }
    async updateContactRequestStatus(id, status) {
        const req = this.data.contactRequests.find((r) => r.id === id);
        if (!req)
            return undefined;
        req.status = status;
        await this.persist();
        return req;
    }
    async getConfig() {
        return { ...this.data.config };
    }
    async updateConfig(newConfig) {
        this.data.config = { ...this.data.config, ...newConfig };
        await this.persist();
        return this.data.config;
    }
};
DatabaseService = DatabaseService_1 = __decorate([
    Injectable()
], DatabaseService);
export { DatabaseService };
//# sourceMappingURL=database.service.js.map