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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { PessoaService } from './pessoa.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';

@ApiTags('pessoas')
@Controller('pessoas')
export class PessoaController {
  constructor(private readonly pessoaService: PessoaService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma pessoa' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Pessoa criada com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro ao criar pessoa.',
  })
  async create(@Body() createPessoaDto: CreatePessoaDto, @Res() res: Response) {
    try {
      const pessoa = await this.pessoaService.create(createPessoaDto);
      return res.status(HttpStatus.CREATED).json(pessoa); // 201 Created
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Erro ao criar pessoa.', // 400 Bad Request
        link: 'https://http.cat/400',
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as pessoas' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de pessoas.' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro ao listar pessoas.',
  })
  async findAll(@Res() res: Response) {
    try {
      const pessoas = await this.pessoaService.findAll();
      return res.status(HttpStatus.OK).json(pessoas); // 200 OK
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Erro ao listar pessoas.', // 400 Bad Request
        link: 'https://http.cat/400',
      });
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma pessoa pelo ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Pessoa encontrada.' })
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
          message: 'Pessoa não encontrada.', // 404 Not Found
          link: 'https://http.cat/404',
        });
      }
      return res.status(HttpStatus.OK).json(pessoa); // 200 OK
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Erro ao buscar pessoa.', // 400 Bad Request
        link: 'https://http.cat/400',
      });
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma pessoa' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pessoa atualizada com sucesso.',
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
    @Body() updatePessoaDto: UpdatePessoaDto,
    @Res() res: Response,
  ) {
    try {
      const pessoa = await this.pessoaService.update(+id, updatePessoaDto);
      if (!pessoa) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Pessoa não encontrada.', // 404 Not Found
          link: 'https://http.cat/404',
        });
      }
      return res.status(HttpStatus.OK).json(pessoa); // 200 OK
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Erro ao atualizar pessoa.', // 400 Bad Request
        link: 'https://http.cat/400',
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
      return res.status(HttpStatus.NO_CONTENT).json(); // 204 No Content
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Erro ao excluir pessoa.', // 400 Bad Request
        link: 'https://http.cat/400',
      });
    }
  }
}
