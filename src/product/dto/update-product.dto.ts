import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const UpdateProductSchema = z
  .object({
    name: z.string().min(1, 'Nome do produto é obrigatório').optional(), // Corrigido para "name"
    code: z.string().min(1, 'Código do produto é obrigatório').optional(),
    supplierId: z
      .string()
      .uuid('ID do fornecedor deve ser um UUID válido')
      .optional(),
  })
  .strict();

export class UpdateProductDto {
  @ApiProperty({ example: 'Produto A', required: false })
  name?: string; // Corrigido para "name" e adicionado opcional

  @ApiProperty({ example: 'PROD001', required: false })
  code?: string;

  @ApiProperty({ example: 'uuid-do-fornecedor', required: false })
  supplierId?: string;
}
