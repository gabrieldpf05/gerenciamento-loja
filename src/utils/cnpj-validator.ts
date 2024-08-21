export function validateCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/[^\d]/g, '');

  // Verifica se tem 14 dígitos
  if (cnpj.length !== 14) return false;

  // Verifica se todos os dígitos são números
  if (!/^\d{14}$/.test(cnpj)) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  return true;
}
