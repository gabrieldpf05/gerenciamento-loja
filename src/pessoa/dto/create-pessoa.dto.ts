import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreatePessoaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve conter 11 dígitos'),
});

export class CreatePessoaDto {
  @ApiProperty({ example: 'João da Silva' })
  nome: string;

  @ApiProperty({ example: 'joao.silva@example.com' })
  email: string;

  @ApiProperty({ example: '12345678901' })
  cpf: string;
}
