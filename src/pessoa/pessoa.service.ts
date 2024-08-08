import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PessoaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPessoaDto: CreatePessoaDto) {
    const { nome, email, cpf } = createPessoaDto;

    const pessoa = await this.prisma.pessoa.create({
      data: {
        nome,
        email,
        cpf,
      } as Prisma.PessoaCreateInput, 
    });
    return pessoa;
  }

  async findAll() {
    return this.prisma.pessoa.findMany();
  }

  async findOne(id: number) {
    return this.prisma.pessoa.findUnique({
      where: { id },
    });
  }

  async update(id: number, updatePessoaDto: UpdatePessoaDto) {
    return this.prisma.pessoa.update({
      where: { id },
      data: updatePessoaDto,
    });
  }

  async remove(id: number) {
    return this.prisma.pessoa.delete({
      where: { id },
    });
  }
}
