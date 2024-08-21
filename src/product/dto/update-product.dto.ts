import { z } from 'zod';

export const UpdateProductSchema = z.object({
  name: z.string().optional(),
  code: z.string().min(3).max(10).optional(),
  supplierIds: z.array(z.string().uuid()).optional(),
});

export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;
