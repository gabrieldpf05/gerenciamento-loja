import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Nome do produto é obrigatório'),
  code: z.string().min(1, 'Código do produto é obrigatório'),
  supplierIds: z
    .array(z.string().uuid('ID do fornecedor deve ser um UUID válido'))
    .nonempty('Pelo menos um fornecedor deve ser fornecido'),
});

export class CreateProductDto {
  @ApiProperty({ example: 'Produto A' })
  name: string;

  @ApiProperty({ example: 'PROD001' })
  code: string;

  @ApiProperty({
    example: ['uuid-do-fornecedor1', 'uuid-do-fornecedor2'],
    description: 'Lista de UUIDs dos fornecedores',
  })
  supplierIds: string[];
}
