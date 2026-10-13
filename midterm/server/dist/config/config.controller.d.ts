import { AuraConfigService } from './config.service.js';
import type { AppConfig } from '../database/database.types.js';
export declare class AuraConfigController {
    private readonly configService;
    constructor(configService: AuraConfigService);
    getConfig(): Promise<AppConfig>;
    updateConfig(body: Partial<AppConfig>): Promise<AppConfig>;
}
