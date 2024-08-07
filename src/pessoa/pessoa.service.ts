import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';

@Injectable()
export class PessoaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPessoaDto: CreatePessoaDto) {
    return this.prisma.pessoa.create({
      data: createPessoaDto,
    });
  }

  async findAll() {
    return this.prisma.pessoa.findMany();
  }

  async findOne(id: number) {
    const pessoa = await this.prisma.pessoa.findUnique({ where: { id } });
    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada.');
    }
    return pessoa;
  }

  async update(id: number, updatePessoaDto: UpdatePessoaDto) {
    const pessoa = await this.prisma.pessoa.findUnique({ where: { id } });
    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada.');
    }
    return this.prisma.pessoa.update({
      where: { id },
      data: updatePessoaDto,
    });
  }

  async remove(id: number) {
    const pessoa = await this.prisma.pessoa.findUnique({ where: { id } });
    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada.');
    }
    await this.prisma.pessoa.delete({ where: { id } });
  }
}