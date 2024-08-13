import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreateSupplierSchema = z.object({
  nome: z.string().min(1, 'Nome do fornecedor é obrigatório'),
  cnpj: z.string().regex(/^\d{14}$/, 'CNPJ deve conter 14 dígitos'),
});

export class CreateSupplierDto {
  @ApiProperty({ example: 'Fornecedor XYZ' })
  nome: string;

  @ApiProperty({ example: '12345678000195' })
  cnpj: string;
}
