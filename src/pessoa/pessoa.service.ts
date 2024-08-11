import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PessoaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPessoaDto: CreatePessoaDto) {
    const { nome, email, cpf } = createPessoaDto;

    const existingPessoa = await this.prisma.pessoa.findUnique({
      where: { cpf },
    });

    if (existingPessoa) {
      throw new ConflictException(`CPF ${cpf} já cadastrado.`);
    }

    try {
      const pessoa = await this.prisma.pessoa.create({
        data: {
          nome,
          email,
          cpf,
        } as Prisma.PessoaCreateInput,
      });
      return pessoa;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    return this.prisma.pessoa.findMany();
  }

  async findOne(id: number) {
    const pessoa = await this.prisma.pessoa.findUnique({
      where: { id },
    });

    if (!pessoa) {
      throw new NotFoundException(`Pessoa com ID ${id} não encontrada.`);
    }

    return pessoa;
  }

  async update(id: number, updatePessoaDto: UpdatePessoaDto) {
    const pessoa = await this.prisma.pessoa.findUnique({
      where: { id },
    });

    if (!pessoa) {
      throw new NotFoundException(`Pessoa com ID ${id} não encontrada.`);
    }

    return this.prisma.pessoa.update({
      where: { id },
      data: updatePessoaDto,
    });
  }

  async remove(id: number) {
    const pessoa = await this.prisma.pessoa.findUnique({
      where: { id },
    });

    if (!pessoa) {
      throw new NotFoundException(`Pessoa com ID ${id} não encontrada.`);
    }

    return this.prisma.pessoa.delete({
      where: { id },
    });
  }
}
