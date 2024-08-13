import { PrismaClient } from '@prisma/client';
import { generateQRCode } from '../src/utils/qr-code';
const prisma = new PrismaClient();

async function main() {
  const fornecedor1 = await prisma.fornecedor.upsert({
    where: { cnpj: '12345678000195' },
    update: {},
    create: {
      nome: 'Fornecedor A',
      cnpj: '12345678000195',
    },
  });

  const fornecedor2 = await prisma.fornecedor.upsert({
    where: { cnpj: '98765432000100' },
    update: {},
    create: {
      nome: 'Fornecedor B',
      cnpj: '98765432000100',
    },
  });
  const produto1 = await prisma.produto.upsert({
    where: { code: 'PROD001' },
    update: {},
    create: {
      nome: 'Produto 1',
      code: 'PROD001',
      qrcode: generateQRCode('PROD001', 'Produto 1', fornecedor1.cnpj),
      fornecedorId: fornecedor1.id,
    },
  });

  const produto2 = await prisma.produto.upsert({
    where: { code: 'PROD002' },
    update: {},
    create: {
      nome: 'Produto 2',
      code: 'PROD002',
      qrcode: generateQRCode('PROD002', 'Produto 2', fornecedor2.cnpj),
      fornecedorId: fornecedor2.id,
    },
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
