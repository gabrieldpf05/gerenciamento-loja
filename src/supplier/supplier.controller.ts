import { Body, Controller, Param, Post, Put, Delete, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto, UpdateSupplierDto } from './dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('suppliers')
@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new supplier' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Supplier created successfully.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Invalid or duplicate CNPJ.' })
  async create(@Body() createSupplierDto: CreateSupplierDto, @Res() res: Response) {
    try {
      const supplier = await this.supplierService.create(createSupplierDto);
      return res.status(HttpStatus.CREATED).json(supplier);
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing supplier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Supplier updated successfully.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Supplier not found.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Invalid or duplicate CNPJ.' })
  async update(@Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto, @Res() res: Response) {
    try {
      const supplier = await this.supplierService.update(+id, updateSupplierDto);
      return res.status(HttpStatus.OK).json(supplier);
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
}
