import { z } from 'zod';

export const SupplierSchema = z.object({
  id: z.string().uuid('ID do fornecedor deve ser um UUID válido'),
  nome: z.string().min(1, 'Nome do fornecedor é obrigatório'),
  cnpj: z.string().regex(/^\d{14}$/, 'CNPJ deve conter 14 dígitos'),
});

export type Supplier = z.infer<typeof SupplierSchema>;
