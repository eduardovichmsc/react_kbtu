import { OnModuleInit } from '@nestjs/common';
import type { Product, PricingPackage, ContactRequest, AppConfig } from './database.types.js';
export declare class DatabaseService implements OnModuleInit {
    private readonly logger;
    private readonly dbFilePath;
    private data;
    private isLoaded;
    onModuleInit(): Promise<void>;
    private init;
    private persist;
    getProducts(): Promise<Product[]>;
    getProductById(id: number): Promise<Product | undefined>;
    createProduct(item: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;
    updateProduct(id: number, updates: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product | undefined>;
    deleteProduct(id: number): Promise<boolean>;
    getPricingPackages(): Promise<PricingPackage[]>;
    getPricingPackageById(id: number): Promise<PricingPackage | undefined>;
    createPricingPackage(item: Omit<PricingPackage, 'id'>): Promise<PricingPackage>;
    getContactRequests(): Promise<ContactRequest[]>;
    createContactRequest(req: Omit<ContactRequest, 'id' | 'createdAt' | 'status'>): Promise<ContactRequest>;
    updateContactRequestStatus(id: number, status: 'PENDING' | 'CONTACTED' | 'COMPLETED'): Promise<ContactRequest | undefined>;
    getConfig(): Promise<AppConfig>;
    updateConfig(newConfig: Partial<AppConfig>): Promise<AppConfig>;
}
