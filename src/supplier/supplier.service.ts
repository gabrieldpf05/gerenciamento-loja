import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { validateCNPJ } from '.utils/cnpj-validator';

@Injectable()
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSupplierDto: CreateSupplierDto) {
    const { name, cnpj } = createSupplierDto;

    if (!validateCNPJ(cnpj)) {
      throw new ConflictException('CNPJ inválido.');
    }

    const existingSupplier = await this.prisma.supplier.findUnique({
      where: { cnpj },
    });

    if (existingSupplier) {
      throw new ConflictException(`CNPJ ${cnpj} já cadastrado.`);
    }

    try {
      return await this.prisma.supplier.create({
        data: { name, cnpj },
      });
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
    });

    if (!supplier) {
      throw new NotFoundException(`Fornecedor com ID ${id} não encontrado.`);
    }

    if (updateSupplierDto.cnpj && !validateCNPJ(updateSupplierDto.cnpj)) {
      throw new ConflictException('CNPJ inválido.');
    }

    return this.prisma.supplier.update({
      where: { id },
      data: updateSupplierDto,
    });
  }

  async findAll() {
    return this.prisma.supplier.findMany({
      include: { products: true },
    });
  }

  async findOne(id: number) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!supplier) {
      throw new NotFoundException(`Fornecedor com ID ${id} não encontrado.`);
    }

    return supplier;
  }

  async remove(id: number) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
    });

    if (!supplier) {
      throw new NotFoundException(`Fornecedor com ID ${id} não encontrado.`);
    }

    await this.prisma.supplier.delete({
      where: { id },
    });
  }
}
