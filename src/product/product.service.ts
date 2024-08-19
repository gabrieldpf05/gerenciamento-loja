import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';
import { generateQRCode } from 'src/utils/qr-generator';
import { validateCNPJ } from 'src/utils/cnpj-validator';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { name, code, supplierIds } = createProductDto;

    const existingProduct = await this.prisma.product.findUnique({
      where: { code },
    });

    if (existingProduct) {
      throw new ConflictException(`Código de produto ${code} já cadastrado.`);
    }

    return this.prisma.$transaction(async (prisma) => {
      const product = await prisma.product.create({
        data: {
          name,
          code,
        } as Prisma.ProductCreateInput,
      });

      const supplierConnections = await Promise.all(
        supplierIds.map(async (supplierId) => {
          const supplier = await prisma.supplier.findUnique({
            where: { id: supplierId },
          });

          if (!supplier) {
            throw new NotFoundException(
              `Fornecedor com ID ${supplierId} não encontrado.`,
            );
          }

          if (!validateCNPJ(supplier.cnpj)) {
            throw new ConflictException(
              `CNPJ do fornecedor ${supplier.cnpj} é inválido.`,
            );
          }

          const qrcode = await generateQRCode(code, name, supplier.cnpj);

          return prisma.supplierProduct.create({
            data: {
              supplierId: supplier.id,
              productId: product.id,
              qrcode,
            },
          });
        }),
      );

      await Promise.all(supplierConnections);

      return product;
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        suppliers: true,
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        suppliers: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { code, name, supplierIds } = updateProductDto;

    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }

    return this.prisma.$transaction(async (prisma) => {
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
          name,
          code,
        },
      });

      await prisma.supplierProduct.deleteMany({
        where: {
          productId: id,
        },
      });

      const supplierConnections = await Promise.all(
        supplierIds.map(async (supplierId) => {
          const supplier = await prisma.supplier.findUnique({
            where: { id: supplierId },
          });

          if (!supplier) {
            throw new NotFoundException(
              `Fornecedor com ID ${supplierId} não encontrado.`,
            );
          }

          if (!validateCNPJ(supplier.cnpj)) {
            throw new ConflictException(
              `CNPJ do fornecedor ${supplier.cnpj} é inválido.`,
            );
          }

          const qrcode = await generateQRCode(code, name, supplier.cnpj);

          return prisma.supplierProduct.create({
            data: {
              supplierId: supplier.id,
              productId: updatedProduct.id,
              qrcode,
            },
          });
        }),
      );

      await Promise.all(supplierConnections);

      return updatedProduct;
    });
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }

    return this.prisma.$transaction(async (prisma) => {
      await prisma.supplierProduct.deleteMany({
        where: {
          productId: id,
        },
      });

      return prisma.product.delete({
        where: { id },
      });
    });
  }
}
