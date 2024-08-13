import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreateProductSchema = z.object({
  nome: z.string().min(1, 'Nome do produto é obrigatório'),
  code: z.string().min(1, 'Código do produto é obrigatório'),
  supplierId: z.string().uuid('ID do fornecedor deve ser um UUID válido'),
});

export class CreateProductDto {
  @ApiProperty({ example: 'Produto A' })
  nome: string;

  @ApiProperty({ example: 'PROD001' })
  code: string;

  @ApiProperty({ example: 'uuid-do-fornecedor' })
  supplierId: string;
}
