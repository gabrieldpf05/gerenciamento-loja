import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UsePipes,
  HttpCode,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  CreateProductDto,
  CreateProductSchema,
} from 'src/product/dto/create-product.dto';
import {
  UpdateProductDto,
  UpdateProductSchema,
} from 'src/product/dto/update-product.dto';
import { ZodValidationPipe } from 'nestjs-zod';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

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
  @UsePipes(new ZodValidationPipe(CreateProductSchema))
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productService.create(createProductDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Product successfully created.',
      data: product,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of all products' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of products.' })
  async findAll() {
    const products = await this.productService.findAll();
    return {
      statusCode: HttpStatus.OK,
      data: products,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific product by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Product found.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found.',
  })
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(id);
    if (!product) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Product not found.',
      };
    }
    return {
      statusCode: HttpStatus.OK,
      data: product,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found.',
  })
  @UsePipes(new ZodValidationPipe(UpdateProductSchema))
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productService.update(id, updateProductDto);
    if (!product) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Product not found.',
      };
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Product successfully updated.',
      data: product,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Product successfully deleted.',
  })
  async remove(@Param('id') id: string) {
    await this.productService.remove(id);
  }
}
