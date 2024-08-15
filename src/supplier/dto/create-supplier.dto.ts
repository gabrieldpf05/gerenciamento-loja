import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreateSupplierSchema = z.object({
  name: z.string().min(1, 'Nome do fornecedor é obrigatório'),
  cnpj: z
    .string()
    .min(1, 'CNPJ é obrigatório')
    .length(14, 'CNPJ deve ter 14 caracteres'),
});

export class CreateSupplierDto {
  @ApiProperty({ example: 'Fornecedor A' })
  name: string;

  @ApiProperty({ example: '12345678000195' })
  cnpj: string;
}

export const UpdateSupplierSchema = z.object({
  name: z.string().min(1, 'Nome do fornecedor é obrigatório').optional(),
  cnpj: z
    .string()
    .min(1, 'CNPJ é obrigatório')
    .length(14, 'CNPJ deve ter 14 caracteres')
    .optional(),
});

export class UpdateSupplierDto {
  @ApiProperty({ example: 'Fornecedor A', required: false })
  name?: string;

  @ApiProperty({ example: '12345678000195', required: false })
  cnpj?: string;
}
