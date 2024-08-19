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
    // Validar o CNPJ fornecido
    if (!validateCNPJ(createSupplierDto.cnpj)) {
      throw new ConflictException('CNPJ inválido.');
    }

    // Verificar se o CNPJ já está cadastrado
    const existingSupplier = await this.prisma.supplier.findUnique({
      where: { cnpj: createSupplierDto.cnpj },
    });
    if (existingSupplier) {
      throw new ConflictException('CNPJ já cadastrado.');
    }

    // Criar um novo fornecedor
    return this.prisma.supplier.create({
      data: createSupplierDto,
    });
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    // Verificar se o fornecedor existe
    const existingSupplier = await this.prisma.supplier.findUnique({
      where: { id },
    });
    if (!existingSupplier) {
      throw new NotFoundException('Fornecedor não encontrado.');
    }

    // Atualizar o fornecedor
    return this.prisma.supplier.update({
      where: { id },
      data: updateSupplierDto,
    });
  }

  async remove(id: string) {
    // Verificar se o fornecedor existe
    const existingSupplier = await this.prisma.supplier.findUnique({
      where: { id },
    });
    if (!existingSupplier) {
      throw new NotFoundException('Fornecedor não encontrado.');
    }

    // Remover o fornecedor
    return this.prisma.supplier.delete({
      where: { id },
    });
  }

  async findAll() {
    // Retornar todos os fornecedores
    return this.prisma.supplier.findMany();
  }

  async findOne(id: string) {
    // Encontrar um fornecedor pelo ID
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
    });
    if (!supplier) {
      throw new NotFoundException('Fornecedor não encontrado.');
    }
    return supplier;
  }
}
