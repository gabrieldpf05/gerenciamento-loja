import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  CreateProductDto,
  CreateProductSchema,
} from './dto/create-product.dto';
import {
  UpdateProductDto,
  UpdateProductSchema,
} from './dto/update-product.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to create product.',
  })
  @ApiResponse({
    status: HttpStatus.PAYLOAD_TOO_LARGE,
    description: 'Data too large.',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Unprocessable entity.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @ApiBody({
    description: 'Product creation details',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Product Name' },
        code: { type: 'string', example: 'CODE001' },
        supplierIds: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
          example: ['550e8400-e29b-41d4-a716-446655440000'],
        },
      },
      required: ['name', 'code'],
    },
  })
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      const product = await this.productService.create(createProductDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Product successfully created.',
        data: product,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error creating product.');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved products.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async findAll() {
    try {
      const products = await this.productService.findAll();
      return {
        statusCode: HttpStatus.OK,
        data: products,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching products.');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single product by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved product.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async findOne(@Param('id') id: string) {
    try {
      const product = await this.productService.findOne(id);
      return {
        statusCode: HttpStatus.OK,
        data: product,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching product.');
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data.' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @ApiBody({
    description: 'Product update details',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Updated Product Name' },
        code: { type: 'string', example: 'UPDATED001' },
        supplierIds: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
          example: ['550e8400-e29b-41d4-a716-446655440000'],
        },
      },
      required: [],
    },
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      const product = await this.productService.update(id, updateProductDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Product successfully updated.',
        data: product,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error updating product.');
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Product successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async remove(@Param('id') id: string) {
    try {
      await this.productService.remove(id);
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: 'Product successfully deleted.',
      };
    } catch (error) {
      throw new InternalServerErrorException('Error deleting product.');
    }
  }
}
