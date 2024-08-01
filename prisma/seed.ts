import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.pessoa.upsert({
    where: { cpf: '12345678901' },
    update: {},
    create: {
      nome: 'Gabriel Souza',
      cpf: '12345678901',
      email: 'gabriel.souza@example.com',
    },
  });

  await prisma.pessoa.upsert({
    where: { cpf: '98765432100' },
    update: {},
    create: {
      nome: 'Maria Silva',
      cpf: '98765432100',
      email: 'maria.silva@example.com',
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
