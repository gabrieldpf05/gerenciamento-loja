import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

// Definição do esquema de validação com Zod
export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Nome do produto é obrigatório'), // Alterado de "nome" para "name"
  code: z.string().min(1, 'Código do produto é obrigatório'),
  supplierId: z.string().uuid('ID do fornecedor deve ser um UUID válido'),
});

// Classe DTO para a criação do produto
export class CreateProductDto {
  @ApiProperty({ example: 'Produto A' })
  name: string; // Alterado de "nome" para "name"

  @ApiProperty({ example: 'PROD001' })
  code: string;

  @ApiProperty({ example: 'uuid-do-fornecedor' })
  supplierId: string;
}
