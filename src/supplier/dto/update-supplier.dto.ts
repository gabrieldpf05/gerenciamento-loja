import { z } from 'zod';

export const UpdateSupplierSchema = z.object({
  nome: z.string().min(1, 'Nome do fornecedor é obrigatório').optional(),
  cnpj: z.string().regex(/^\d{14}$/, 'CNPJ deve conter 14 dígitos').optional(),
}).strict();

export type UpdateSupplierDto = z.infer<typeof UpdateSupplierSchema>;
