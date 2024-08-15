import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from 'src/product/dto/update-product.dto';
import { Prisma } from '@prisma/client';
import { generateQRCode } from 'src/utils/qr-generator';
import { validateCNPJ } from 'src/utils/cnpj-validator';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { name, code, supplierId } = createProductDto;

    const existingProduct = await this.prisma.product.findUnique({
      where: { code },
    });

    if (existingProduct) {
      throw new ConflictException(`Código de produto ${code} já cadastrado.`);
    }

    const supplier = await this.prisma.supplier.findUnique({
      where: { id: supplierId },
    });

    if (!supplier) {
      throw new NotFoundException(
        `Fornecedor com ID ${supplierId} não encontrado.`,
      );
    }

    if (!validateCNPJ(supplier.cnpj)) {
      throw new ConflictException('CNPJ do fornecedor é inválido.');
    }

    const qrcode = await generateQRCode(code, name, supplier.cnpj);

    return this.prisma.product.create({
      data: {
        name,
        code,
        qrcode,
        suppliers: {
          connect: { id: supplierId },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany();
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { code, name, supplierId } = updateProductDto;

    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }

    const supplier = await this.prisma.supplier.findUnique({
      where: { id: supplierId },
    });

    if (!supplier) {
      throw new NotFoundException(
        `Fornecedor com ID ${supplierId} não encontrado.`,
      );
    }

    if (!validateCNPJ(supplier.cnpj)) {
      throw new ConflictException('CNPJ do fornecedor é inválido.');
    }

    const qrcode =
      code && name && supplier.cnpj
        ? await generateQRCode(code, name, supplier.cnpj)
        : product.qrcode;

    return this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto,
        qrcode,
      },
    });
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
