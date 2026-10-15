import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { ProductsModule } from './products/products.module.js';
import { PricingModule } from './pricing/pricing.module.js';
import { ContactModule } from './contact/contact.module.js';
import { AppConfigModule } from './config/app-config.module.js';

@Module({
  imports: [
    DatabaseModule,
    ProductsModule,
    PricingModule,
    ContactModule,
    AppConfigModule,
  ],
})
export class AppModule {}
