import { z } from 'zod';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { PessoaService } from './pessoa.service';
import { CreatePessoaDto, CreatePessoaSchema, CreatePessoaDtoSwagger } from './dto/create-pessoa.dto';
import { UpdatePessoaDto, UpdatePessoaSchema, UpdatePessoaDtoSwagger } from './dto/create-pessoa.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('pessoas')
@Controller('pessoas')
export class PessoaController {
  constructor(private readonly pessoaService: PessoaService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma pessoa' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Pessoa criada com sucesso.',
    schema: {
      example: {
        id: 1,
        nome: 'João Silva',
        email: 'joao.silva@example.com',
        cpf: '12345678901',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro ao criar pessoa.',
  })
  async create(@Body() body: CreatePessoaDtoSwagger, @Res() res: Response) {
    try {
      const createPessoaDto = CreatePessoaSchema.parse(body);
      const pessoa = await this.pessoaService.create(createPessoaDto);
      return res.status(HttpStatus.CREATED).json(pessoa);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.errors.map(e => e.message).join(', '),
          link: 'https://http.cat/400',
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro interno do servidor.',
        link: 'https://http.cat/500',
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as pessoas' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de pessoas.',
    schema: {
      example: [
        {
          id: 1,
          nome: 'João Silva',
          email: 'joao.silva@example.com',
          cpf: '12345678901',
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro ao listar pessoas.',
  })
  async findAll(@Res() res: Response) {
    try {
      const pessoas = await this.pessoaService.findAll();
      return res.status(HttpStatus.OK).json(pessoas);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Erro ao listar pessoas.',
        link: 'https://http.cat/400',
      });
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma pessoa pelo ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pessoa encontrada.',
    schema: {
      example: {
        id: 1,
        nome: 'João Silva',
        email: 'joao.silva@example.com',
        cpf: '12345678901',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pessoa não encontrada.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro ao buscar pessoa.',
  })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const pessoa = await this.pessoaService.findOne(+id);
      if (!pessoa) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Pessoa não encontrada.',
          link: 'https://http.cat/404',
        });
      }
      return res.status(HttpStatus.OK).json(pessoa);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Erro ao buscar pessoa.',
        link: 'https://http.cat/400',
      });
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma pessoa' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pessoa atualizada com sucesso.',
    schema: {
      example: {
        id: 1,
        nome: 'João Silva',
        email: 'joao.silva@example.com',
        cpf: '12345678901',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pessoa não encontrada.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro ao atualizar pessoa.',
  })
  async update(
    @Param('id') id: string,
    @Body() body: UpdatePessoaDtoSwagger,
    @Res() res: Response,
  ) {
    try {
      const updatePessoaDto = UpdatePessoaSchema.parse(body);
      const pessoa = await this.pessoaService.update(+id, updatePessoaDto);
      if (!pessoa) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Pessoa não encontrada.',
          link: 'https://http.cat/404',
        });
      }
      return res.status(HttpStatus.OK).json(pessoa);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.errors.map(e => e.message).join(', '),
          link: 'https://http.cat/400',
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro interno do servidor.',
        link: 'https://http.cat/500',
      });
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir uma pessoa' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Pessoa excluída com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro ao excluir pessoa.',
  })
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.pessoaService.remove(+id);
      return res.status(HttpStatus.NO_CONTENT).json();
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Erro ao excluir pessoa.',
        link: 'https://http.cat/400',
      });
    }
  }
}
