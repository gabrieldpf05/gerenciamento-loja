import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

// Esquema de validação com Zod
export const UpdateProductSchema = z
  .object({
    name: z.string().min(1, 'Nome do produto é obrigatório').optional(),
    code: z.string().min(1, 'Código do produto é obrigatório').optional(),
    supplierIds: z
      .array(z.string().uuid('ID do fornecedor deve ser um UUID válido'))
      .optional(),
  })
  .strict();
export class UpdateProductDto {
  @ApiProperty({ example: 'Produto A', required: false })
  name?: string;

  @ApiProperty({ example: 'PROD001', required: false })
  code?: string;

  @ApiProperty({
    example: ['uuid-do-fornecedor1', 'uuid-do-fornecedor2'],
    required: false,
    description: 'Lista de UUIDs dos fornecedores',
  })
  supplierIds?: string[];
}
