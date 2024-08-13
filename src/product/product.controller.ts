import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { ProductService } from './product.service';
import { CreateProductDto, CreateProductSchema } from './dto/create-product.dto';
import { UpdateProductDto, UpdateProductSchema } from './dto/update-product.dto';
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
  async create(@Body() createProductDto: CreateProductDto, @Res() res: Response) {
    const product = await this.productService.create(createProductDto);
    return res.status(HttpStatus.CREATED).json(product);
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of all products' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of products.' })
  async findAll(@Res() res: Response) {
    const products = await this.productService.findAll();
    return res.status(HttpStatus.OK).json(products);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific product by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Product found.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found.',
  })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const product = await this.productService.findOne(id);
    if (!product) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Product not found.',
      });
    }
    return res.status(HttpStatus.OK).json(product);
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
    @Res() res: Response,
  ) {
    const product = await this.productService.update(id, updateProductDto);
    if (!product) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Product not found.',
      });
    }
    return res.status(HttpStatus.OK).json(product);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Product successfully deleted.',
  })
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.productService.remove(id);
    return res.status(HttpStatus.NO_CONTENT).json();
  }
}
