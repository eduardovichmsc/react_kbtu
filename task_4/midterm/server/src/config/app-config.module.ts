import { Module } from '@nestjs/common';
import { AuraConfigService } from './config.service.js';
import { AuraConfigController } from './config.controller.js';

@Module({
  controllers: [AuraConfigController],
  providers: [AuraConfigService],
  exports: [AuraConfigService],
})
export class AppConfigModule {}
