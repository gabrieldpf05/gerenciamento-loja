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
    description: 'Failed to create product. Veja https://http.cat/400',
  })
  @ApiResponse({
    status: HttpStatus.PAYLOAD_TOO_LARGE,
    description: 'Dados de entrada muito grandes. Veja https://http.cat/413',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Dados de entrada inválidos. Veja https://http.cat/422',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Erro interno do servidor. Veja https://http.cat/500',
  })
  @UsePipes(new ZodValidationPipe(CreateProductSchema))
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      const product = await this.productService.create(createProductDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Product successfully created.',
        data: product,
      };
    } catch (error) {
      throw new Error('Erro ao criar o produto. Veja https://http.cat/500');
    }
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
    description: 'Product not found. Veja https://http.cat/404',
  })
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(id);
    if (!product) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Product not found. Veja https://http.cat/404',
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
    description: 'Product not found. Veja https://http.cat/404',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Dados de entrada inválidos. Veja https://http.cat/422',
  })
  @UsePipes(new ZodValidationPipe(UpdateProductSchema))
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      const product = await this.productService.update(id, updateProductDto);
      if (!product) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Product not found. Veja https://http.cat/404',
        };
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Product successfully updated.',
        data: product,
      };
    } catch (error) {
      throw new Error('Erro ao atualizar o produto. Veja https://http.cat/500');
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Product successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found. Veja https://http.cat/404',
  })
  async remove(@Param('id') id: string) {
    const product = await this.productService.remove(id);
    if (!product) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Product not found. Veja https://http.cat/404',
      };
    }
  }
}
