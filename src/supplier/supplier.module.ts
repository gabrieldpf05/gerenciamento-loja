import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Importa o módulo Prisma para injetar o serviço Prisma no SupplierService
  controllers: [SupplierController], // Declara o controller do módulo
  providers: [SupplierService], // Declara os serviços providos pelo módulo
  exports: [SupplierService], // Exporta o serviço SupplierService para que ele possa ser usado em outros módulos, se necessário
})
export class SupplierModule {}
