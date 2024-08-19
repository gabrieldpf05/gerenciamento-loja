import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string().uuid('ID do produto deve ser um UUID válido'),
  name: z.string().min(1, 'Nome do produto é obrigatório'),
  code: z.string().min(1, 'Código do produto é obrigatório'),
  qrcode: z.string().optional(),
  supplierIds: z
    .array(z.string().uuid('ID do fornecedor deve ser um UUID válido'))
    .nonempty('Pelo menos um fornecedor deve ser fornecido'),
});

export type Product = z.infer<typeof ProductSchema>;
