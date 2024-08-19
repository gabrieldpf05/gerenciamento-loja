import { PrismaClient } from '@prisma/client';
import { validateCNPJ } from 'src/utils/cnpj-validator';
import { generateQRCode } from 'src/utils/qr-generator';

const prisma = new PrismaClient();

const ensureUniqueCNPJ = async (cnpj: string) => {
  if (!validateCNPJ(cnpj)) {
    throw new Error('CNPJ inválido.');
  }
  const existingSupplier = await prisma.supplier.findUnique({
    where: { cnpj },
  });
  if (existingSupplier) {
    throw new Error('CNPJ já cadastrado.');
  }
};

async function main() {
  await ensureUniqueCNPJ('12345678000195');
  await ensureUniqueCNPJ('98765432000198');

  const supplier1 = await prisma.supplier.create({
    data: {
      cnpj: '12345678000195',
      name: 'Fornecedor X',
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      cnpj: '98765432000198',
      name: 'Fornecedor Y',
    },
  });

  const product1 = await prisma.product.create({
    data: {
      name: 'Cimento',
      code: 'CIM123',
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Areia',
      code: 'ARE456',
    },
  });

  await prisma.$transaction(async (prisma) => {
    const qrcode1 = await generateQRCode('CIM123', 'Cimento', supplier1.cnpj);
    const qrcode2 = await generateQRCode('ARE456', 'Areia', supplier1.cnpj);
    const qrcode3 = await generateQRCode('CIM123', 'Cimento', supplier2.cnpj);

    await prisma.supplierProduct.create({
      data: {
        supplierId: supplier1.id,
        productId: product1.id,
        qrcode: qrcode1,
      },
    });

    await prisma.supplierProduct.create({
      data: {
        supplierId: supplier1.id,
        productId: product2.id,
        qrcode: qrcode2,
      },
    });

    await prisma.supplierProduct.create({
      data: {
        supplierId: supplier2.id,
        productId: product1.id,
        qrcode: qrcode3,
      },
    });
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
