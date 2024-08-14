import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { validateCNPJ } from '../src/common/utils/cnpj-validator';

const prisma = new PrismaClient();


const ensureUniqueCNPJ = async (cnpj: string) => {
  if (!validateCNPJ(cnpj)) {
    throw new Error('CNPJ inválido.');
  }
  const existingSupplier = await prisma.supplier.findUnique({ where: { cnpj } });
  if (existingSupplier) {
    throw new Error('CNPJ já cadastrado.');
  }
};

async function main() {
  
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

  
  await prisma.product.create({
    data: {
      name: 'Cimento',
      code: 'CIM123',
      suppliers: {
        connect: [{ id: supplier1.id }, { id: supplier2.id }], 
      },
    },
  });

  await prisma.product.create({
    data: {
      name: 'Areia',
      code: 'ARE456',
      suppliers: {
        connect: [{ id: supplier1.id }], 
      },
    },
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
