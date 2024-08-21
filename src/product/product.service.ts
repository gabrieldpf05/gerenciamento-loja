import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { generateQRCode } from 'src/utils/qr-generator';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { name, code, supplierIds } = createProductDto;

    try {
      const existingProduct = await this.prisma.product.findUnique({
        where: { code },
      });

      if (existingProduct) {
        throw new ConflictException(
          `Product with code ${code} already exists.`,
        );
      }

      const product = await this.prisma.$transaction(async (prisma) => {
        const createdProduct = await prisma.product.create({
          data: { name, code },
        });

        await Promise.all(
          supplierIds.map(async (supplierId) => {
            const supplier = await prisma.supplier.findUnique({
              where: { id: supplierId },
            });
            if (!supplier) {
              throw new NotFoundException(
                `Supplier with ID ${supplierId} not found.`,
              );
            }

            const qrcode = await generateQRCode(code, name, supplier.cnpj);
            await prisma.supplierProduct.create({
              data: {
                supplierId: supplier.id,
                productId: createdProduct.id,
                qrcode,
              },
            });
          }),
        );

        return createdProduct;
      });

      return product;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating product.');
    }
  }

  async findAll() {
    try {
      return await this.prisma.product.findMany({
        include: { suppliers: true },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error fetching products.');
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: { suppliers: true },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found.`);
      }

      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching product.');
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { code, name, supplierIds } = updateProductDto;

    try {
      const existingProduct = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        throw new NotFoundException(`Product with ID ${id} not found.`);
      }

      const updatedProduct = await this.prisma.$transaction(async (prisma) => {
        const product = await prisma.product.update({
          where: { id },
          data: { name, code },
        });

        await prisma.supplierProduct.deleteMany({ where: { productId: id } });

        await Promise.all(
          supplierIds.map(async (supplierId) => {
            const supplier = await prisma.supplier.findUnique({
              where: { id: supplierId },
            });
            if (!supplier) {
              throw new NotFoundException(
                `Supplier with ID ${supplierId} not found.`,
              );
            }

            const qrcode = await generateQRCode(code, name, supplier.cnpj);
            await prisma.supplierProduct.create({
              data: {
                supplierId: supplier.id,
                productId: product.id,
                qrcode,
              },
            });
          }),
        );

        return product;
      });

      return updatedProduct;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating product.');
    }
  }

  async remove(id: string) {
    try {
      const product = await this.prisma.product.findUnique({ where: { id } });

      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found.`);
      }

      await this.prisma.$transaction(async (prisma) => {
        await prisma.supplierProduct.deleteMany({ where: { productId: id } });
        await prisma.product.delete({ where: { id } });
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting product.');
    }
  }
}
