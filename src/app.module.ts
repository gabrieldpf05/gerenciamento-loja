import { Module } from '@nestjs/common';
import { PessoaModule } from './pessoa/pessoa.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    // Importa o módulo responsável pelo CRUD de pessoa
    PessoaModule,

    // Outros módulos, como o módulo do Prisma para acesso ao banco de dados
    PrismaModule,
  ],
  controllers: [], // Se o AppModule tivesse controladores específicos, eles seriam listados aqui.
  providers: [], // Se o AppModule tivesse serviços ou outros providers específicos, eles seriam listados aqui.
})
export class AppModule {}
