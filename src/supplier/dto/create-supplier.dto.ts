import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { validateCNPJ } from 'src/utils/cnpj-validator';

export const CreateSupplierSchema = z.object({
  name: z.string().min(1, 'Nome do fornecedor é obrigatório'),
  cnpj: z
    .string()
    .length(14, 'CNPJ deve ter 14 caracteres')
    .refine((value) => validateCNPJ(value), 'CNPJ inválido'),
});

export class CreateSupplierDto {
  @ApiProperty({ example: 'Fornecedor X' })
  name: string;

  @ApiProperty({ example: '12345678000195' })
  cnpj: string;
}
