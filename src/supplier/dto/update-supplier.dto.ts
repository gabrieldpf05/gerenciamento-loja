import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const UpdateSupplierSchema = z
  .object({
    name: z.string().min(1, 'Nome do fornecedor é obrigatório').optional(),
    cnpj: z
      .string()
      .regex(/^\d{14}$/, 'CNPJ deve conter 14 dígitos')
      .optional(),
  })
  .strict();

export class UpdateSupplierDto {
  @ApiProperty({ example: 'Fornecedor X', required: false })
  name?: string;

  @ApiProperty({ example: '12345678000195', required: false })
  cnpj?: string;
}
