import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Delete,
  Get,
  Res,
  HttpStatus,
  UsePipes,
  HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { SupplierService } from './supplier.service';
import {
  CreateSupplierDto,
  CreateSupplierSchema,
} from './dto/create-supplier.dto';
import {
  UpdateSupplierDto,
  UpdateSupplierSchema,
} from './dto/update-supplier.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';

@ApiTags('suppliers')
@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new supplier' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Supplier created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Invalid or duplicate CNPJ. Veja https://http.cat/409',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Dados de entrada inválidos. Veja https://http.cat/422',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Erro interno do servidor. Veja https://http.cat/500',
  })
  @UsePipes(new ZodValidationPipe(CreateSupplierSchema))
  async create(
    @Body() createSupplierDto: CreateSupplierDto,
    @Res() res: Response,
  ) {
    try {
      const supplier = await this.supplierService.create(createSupplierDto);
      return res.status(HttpStatus.CREATED).json(supplier);
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          error.message ||
          'Erro ao criar o fornecedor. Veja https://http.cat/500',
      });
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing supplier' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Supplier updated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Supplier not found. Veja https://http.cat/404',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Invalid or duplicate CNPJ. Veja https://http.cat/409',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Dados de entrada inválidos. Veja https://http.cat/422',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Erro interno do servidor. Veja https://http.cat/500',
  })
  @UsePipes(new ZodValidationPipe(UpdateSupplierSchema))
  async update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
    @Res() res: Response,
  ) {
    try {
      const supplier = await this.supplierService.update(id, updateSupplierDto);
      return res.status(HttpStatus.OK).json(supplier);
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          error.message ||
          'Erro ao atualizar o fornecedor. Veja https://http.cat/500',
      });
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a supplier' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Supplier deleted successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Supplier not found. Veja https://http.cat/404',
  })
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.supplierService.remove(id);
      return res
        .status(HttpStatus.NO_CONTENT)
        .json({ message: 'Supplier deleted successfully.' });
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          error.message ||
          'Erro ao deletar o fornecedor. Veja https://http.cat/500',
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all suppliers' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of suppliers retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Erro interno do servidor. Veja https://http.cat/500',
  })
  async findAll(@Res() res: Response) {
    try {
      const suppliers = await this.supplierService.findAll();
      return res.status(HttpStatus.OK).json(suppliers);
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          error.message ||
          'Erro ao recuperar os fornecedores. Veja https://http.cat/500',
      });
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a supplier by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Supplier retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Supplier not found. Veja https://http.cat/404',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Erro interno do servidor. Veja https://http.cat/500',
  })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const supplier = await this.supplierService.findOne(id);
      if (!supplier) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Supplier not found. Veja https://http.cat/404',
        });
      }
      return res.status(HttpStatus.OK).json(supplier);
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          error.message ||
          'Erro ao recuperar o fornecedor. Veja https://http.cat/500',
      });
    }
  }
}
