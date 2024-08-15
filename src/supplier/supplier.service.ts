import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { validateCNPJ } from 'src/utils/cnpj-validator';

@Injectable()
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSupplierDto: CreateSupplierDto) {
    if (!validateCNPJ(createSupplierDto.cnpj)) {
      throw new ConflictException('CNPJ inválido.');
    }

    const existingSupplier = await this.prisma.supplier.findUnique({
      where: { cnpj: createSupplierDto.cnpj },
    });
    if (existingSupplier) {
      throw new ConflictException('CNPJ já cadastrado.');
    }

    return this.prisma.supplier.create({
      data: createSupplierDto,
    });
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    const existingSupplier = await this.prisma.supplier.findUnique({
      where: { id },
    });
    if (!existingSupplier) {
      throw new NotFoundException('Fornecedor não encontrado.');
    }

    return this.prisma.supplier.update({
      where: { id },
      data: updateSupplierDto,
    });
  }

  async remove(id: string) {
    const existingSupplier = await this.prisma.supplier.findUnique({
      where: { id },
    });
    if (!existingSupplier) {
      throw new NotFoundException('Fornecedor não encontrado.');
    }

    return this.prisma.supplier.delete({
      where: { id },
    });
  }

  async findAll() {
    return this.prisma.supplier.findMany();
  }

  async findOne(id: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
    });
    if (!supplier) {
      throw new NotFoundException('Fornecedor não encontrado.');
    }
    return supplier;
  }
}
