import { z } from 'zod';

export const CreatePessoaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve conter 11 dígitos'),
});

export type CreatePessoaDto = z.infer<typeof CreatePessoaSchema>;

export class CreatePessoaDtoSwagger {
  nome: string;
  email: string;
  cpf: string;
}

export class UpdatePessoaDtoSwagger {
  nome?: string;
  email?: string;
  cpf?: string;
}

export const UpdatePessoaSchema = z.object({
  nome: z.string().optional(),
  email: z.string().email('Email inválido').optional(),
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve conter 11 dígitos').optional(),
});

export type UpdatePessoaDto = z.infer<typeof UpdatePessoaSchema>;
