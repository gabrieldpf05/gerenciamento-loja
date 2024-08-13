import { z } from 'zod';

export const UpdateProductSchema = z.object({
  nome: z.string().min(1, 'Nome do produto é obrigatório').optional(),
  code: z.string().min(1, 'Código do produto é obrigatório').optional(),
  supplierId: z.string().uuid('ID do fornecedor deve ser um UUID válido').optional(),
}).strict();

export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;
