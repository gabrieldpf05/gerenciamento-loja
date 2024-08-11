import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { PessoaService } from './pessoa.service';
import { CreatePessoaDto, CreatePessoaSchema } from './dto/create-pessoa.dto';
import { UpdatePessoaDto, UpdatePessoaSchema } from './dto/update-pessoa.dto'; 
import { ZodValidationPipe } from 'nestjs-zod';
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
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro ao criar pessoa.',
  })
  @UsePipes(new ZodValidationPipe(CreatePessoaSchema))
  async create(@Body() createPessoaDto: CreatePessoaDto, @Res() res: Response) {
    const pessoa = await this.pessoaService.create(createPessoaDto);
    return res.status(HttpStatus.CREATED).json(pessoa);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as pessoas' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de pessoas.' })
  async findAll(@Res() res: Response) {
    const pessoas = await this.pessoaService.findAll();
    return res.status(HttpStatus.OK).json(pessoas);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma pessoa pelo ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Pessoa encontrada.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pessoa não encontrada.',
  })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const pessoa = await this.pessoaService.findOne(+id);
    if (!pessoa) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Pessoa não encontrada.',
      });
    }
    return res.status(HttpStatus.OK).json(pessoa);
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
  @UsePipes(new ZodValidationPipe(UpdatePessoaSchema))
  async update(
    @Param('id') id: string,
    @Body() updatePessoaDto: UpdatePessoaDto,
    @Res() res: Response,
  ) {
    const pessoa = await this.pessoaService.update(+id, updatePessoaDto);
    if (!pessoa) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Pessoa não encontrada.',
      });
    }
    return res.status(HttpStatus.OK).json(pessoa);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir uma pessoa' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Pessoa excluída com sucesso.',
  })
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.pessoaService.remove(+id);
    return res.status(HttpStatus.NO_CONTENT).json();
  }
}
