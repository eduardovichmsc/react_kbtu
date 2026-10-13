import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import type { AppConfig } from '../database/database.types.js';

@Injectable()
export class AuraConfigService {
  constructor(private readonly db: DatabaseService) {}

  async getConfig(): Promise<AppConfig> {
    return this.db.getConfig();
  }

  async updateConfig(newConfig: Partial<AppConfig>): Promise<AppConfig> {
    return this.db.updateConfig(newConfig);
  }
}
