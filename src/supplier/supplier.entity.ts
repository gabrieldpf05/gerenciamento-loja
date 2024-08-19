import { z } from 'zod';

export const SupplierSchema = z.object({
  id: z.string().uuid('ID do fornecedor deve ser um UUID válido'),
  nome: z.string().min(1, 'Nome do fornecedor é obrigatório'),
  cnpj: z
    .string()
    .regex(/^\d{14}$/, 'CNPJ deve conter 14 dígitos')
    .refine(
      (cnpj) => {
        // Lógica para validar se o CNPJ é válido
        return isValidCNPJ(cnpj);
      },
      {
        message: 'CNPJ inválido',
      },
    ),
});

export type Supplier = z.infer<typeof SupplierSchema>;

/**
 * Função para validar se um CNPJ é válido.
 * Baseada na verificação dos dígitos verificadores.
 * @param cnpj - CNPJ a ser validado.
 * @returns boolean - Retorna `true` se o CNPJ for válido, `false` caso contrário.
 */
function isValidCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  const cleanedCNPJ = cnpj.replace(/\D/g, '');

  // CNPJ deve ter 14 dígitos
  if (cleanedCNPJ.length !== 14) return false;

  // Validação de CNPJs inválidos conhecidos
  if (/^(\d)\1+$/.test(cleanedCNPJ)) return false;

  // Calcula o primeiro dígito verificador
  const validateDigit = (base: string, factors: number[]) => {
    const sum = base
      .split('')
      .map((digit, index) => parseInt(digit, 10) * factors[index])
      .reduce((acc, curr) => acc + curr, 0);

    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstBase = cleanedCNPJ.slice(0, 12);
  const firstFactors = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const firstDigit = validateDigit(firstBase, firstFactors);

  const secondBase = cleanedCNPJ.slice(0, 13);
  const secondFactors = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const secondDigit = validateDigit(secondBase, secondFactors);

  // Compara os dígitos calculados com os dígitos verificadores do CNPJ
  return (
    firstDigit === parseInt(cleanedCNPJ.charAt(12), 10) &&
    secondDigit === parseInt(cleanedCNPJ.charAt(13), 10)
  );
}
