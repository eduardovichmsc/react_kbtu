import { DatabaseService } from '../database/database.service.js';
import type { AppConfig } from '../database/database.types.js';
export declare class AuraConfigService {
    private readonly db;
    constructor(db: DatabaseService);
    getConfig(): Promise<AppConfig>;
    updateConfig(newConfig: Partial<AppConfig>): Promise<AppConfig>;
}
