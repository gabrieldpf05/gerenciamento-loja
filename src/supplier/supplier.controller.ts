import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Delete,
  Get,
  HttpStatus,
  UsePipes,
  HttpCode,
} from '@nestjs/common';
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
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data. Veja https://http.cat/400',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Invalid data format. Veja https://http.cat/422',
  })
  @UsePipes(new ZodValidationPipe(CreateSupplierSchema))
  async create(@Body() createSupplierDto: CreateSupplierDto) {
    try {
      const supplier = await this.supplierService.create(createSupplierDto);
      return { statusCode: HttpStatus.CREATED, data: supplier };
    } catch (error) {
      throw error;
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
    description: 'Invalid data format. Veja https://http.cat/422',
  })
  async update(
    @Body(new ZodValidationPipe(UpdateSupplierSchema))
    updateSupplierDto: UpdateSupplierDto,
    @Param('id') id: string,
  ) {
    try {
      const supplier = await this.supplierService.update(id, updateSupplierDto);
      return { statusCode: HttpStatus.OK, data: supplier };
    } catch (error) {
      throw error;
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
  async remove(@Param('id') id: string) {
    try {
      await this.supplierService.remove(id);
    } catch (error) {
      throw error;
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
    description: 'Internal server error. Veja https://http.cat/500',
  })
  async findAll() {
    try {
      const suppliers = await this.supplierService.findAll();
      return { statusCode: HttpStatus.OK, data: suppliers };
    } catch (error) {
      throw error;
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
    description: 'Internal server error. Veja https://http.cat/500',
  })
  async findOne(@Param('id') id: string) {
    try {
      const supplier = await this.supplierService.findOne(id);
      return { statusCode: HttpStatus.OK, data: supplier };
    } catch (error) {
      throw error;
    }
  }
}
