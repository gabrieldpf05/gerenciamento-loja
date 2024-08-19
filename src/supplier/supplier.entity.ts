import { z } from 'zod';

import { validateCNPJ } from '../utils/cnpj-validator';

export const SupplierSchema = z.object({
  id: z.string().uuid('ID do fornecedor deve ser um UUID válido'),
  name: z.string().min(1, 'Nome do fornecedor é obrigatório'),
  cnpj: z
    .string()
    .length(14, 'CNPJ deve ter 14 caracteres')
    .refine((cnpj) => validateCNPJ(cnpj), {
      message: 'CNPJ inválido',
    }),
});

export type Supplier = z.infer<typeof SupplierSchema>;
