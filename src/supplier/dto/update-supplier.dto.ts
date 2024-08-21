import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { validateCNPJ } from 'src/utils/cnpj-validator';

export const UpdateSupplierSchema = z.object({
  name: z.string().min(1, 'Nome do fornecedor é obrigatório').optional(),
  cnpj: z
    .string()
    .length(14, 'CNPJ deve ter 14 caracteres')
    .refine((value) => validateCNPJ(value), 'CNPJ inválido')
    .optional(),
});

export class UpdateSupplierDto {
  @ApiProperty({ example: 'Fornecedor X', required: false })
  name?: string;

  @ApiProperty({ example: '12345678000195', required: false })
  cnpj?: string;
}
