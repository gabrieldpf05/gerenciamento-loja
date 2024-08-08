import { Module } from '@nestjs/common';
import { PessoaModule } from './pessoa/pessoa.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PessoaModule, PrismaModule],
})
export class AppModule {}
