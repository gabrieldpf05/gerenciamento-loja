import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
