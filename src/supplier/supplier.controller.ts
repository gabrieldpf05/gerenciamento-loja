import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto, CreateSupplierSchema } from './dto/create-supplier.dto';
import { UpdateSupplierDto, UpdateSupplierSchema } from './dto/update-supplier.dto';
import { ZodValidationPipe } from 'nestjs-zod';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('suppliers')
@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new supplier' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Supplier successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to create supplier.',
  })
  @UsePipes(new ZodValidationPipe(CreateSupplierSchema))
  async create(@Body() createSupplierDto: CreateSupplierDto, @Res() res: Response) {
    const supplier = await this.supplierService.create(createSupplierDto);
    return res.status(HttpStatus.CREATED).json(supplier);
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of all suppliers' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of suppliers.' })
  async findAll(@Res() res: Response) {
    const suppliers = await this.supplierService.findAll();
    return res.status(HttpStatus.OK).json(suppliers);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific supplier by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Supplier found.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Supplier not found.',
  })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const supplier = await this.supplierService.findOne(id);
    if (!supplier) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Supplier not found.',
      });
    }
    return res.status(HttpStatus.OK).json(supplier);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a supplier' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Supplier successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Supplier not found.',
  })
  @UsePipes(new ZodValidationPipe(UpdateSupplierSchema))
  async update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
    @Res() res: Response,
  ) {
    const supplier = await this.supplierService.update(id, updateSupplierDto);
    if (!supplier) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Supplier not found.',
      });
    }
    return res.status(HttpStatus.OK).json(supplier);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a supplier' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Supplier successfully deleted.',
  })
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.supplierService.remove(id);
    return res.status(HttpStatus.NO_CONTENT).json();
  }
}
