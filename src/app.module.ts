import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { SupplierModule } from './supplier/supplier.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    SupplierModule,
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
