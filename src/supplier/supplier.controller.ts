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
} from '@nestjs/common';
import { Response } from 'express';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
    description: 'Invalid or duplicate CNPJ.',
  })
  async create(
    @Body() createSupplierDto: CreateSupplierDto,
    @Res() res: Response,
  ) {
    try {
      const supplier = await this.supplierService.create(createSupplierDto);
      return res.status(HttpStatus.CREATED).json(supplier);
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
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
    description: 'Supplier not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Invalid or duplicate CNPJ.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
    @Res() res: Response,
  ) {
    try {
      const supplier = await this.supplierService.update(id, updateSupplierDto);
      return res.status(HttpStatus.OK).json(supplier);
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a supplier' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Supplier deleted successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Supplier not found.',
  })
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.supplierService.remove(id);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Supplier deleted successfully.' });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all suppliers' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of suppliers retrieved successfully.',
  })
  async findAll(@Res() res: Response) {
    try {
      const suppliers = await this.supplierService.findAll();
      return res.status(HttpStatus.OK).json(suppliers);
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
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
    description: 'Supplier not found.',
  })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const supplier = await this.supplierService.findOne(id);
      return res.status(HttpStatus.OK).json(supplier);
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
