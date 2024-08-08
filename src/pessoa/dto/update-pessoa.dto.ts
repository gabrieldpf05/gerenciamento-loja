import { z } from 'zod';

export const UpdatePessoaSchema = z.object({
  nome: z.string().optional(),
  email: z.string().email('Email inválido').optional(),
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve conter 11 dígitos').optional(),
});

export type UpdatePessoaDto = z.infer<typeof UpdatePessoaSchema>;
