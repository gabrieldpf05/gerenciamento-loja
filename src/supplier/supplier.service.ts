import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSupplierDto: CreateSupplierDto) {
    const { name, cnpj } = createSupplierDto;

    const existingSupplier = await this.prisma.supplier.findUnique({
      where: { cnpj },
    });

    if (existingSupplier) {
      throw new ConflictException(`CNPJ ${cnpj} já cadastrado.`);
    }

    try {
      const supplier = await this.prisma.supplier.create({
        data: {
          name,
          cnpj,
        } as Prisma.SupplierCreateInput,
      });
      return supplier;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    return this.prisma.supplier.findMany();
  }

  async findOne(id: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
    });

    if (!supplier) {
      throw new NotFoundException(`Fornecedor com ID ${id} não encontrado.`);
    }

    return supplier;
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
    });

    if (!supplier) {
      throw new NotFoundException(`Fornecedor com ID ${id} não encontrado.`);
    }

    return this.prisma.supplier.update({
      where: { id },
      data: updateSupplierDto,
    });
  }

  async remove(id: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
    });

    if (!supplier) {
      throw new NotFoundException(`Fornecedor com ID ${id} não encontrado.`);
    }

    return this.prisma.supplier.delete({
      where: { id },
    });
  }
}
