export function validateCNPJ(cnpj: string): boolean {
    // Remove caracteres não numéricos
    cnpj = cnpj.replace(/[^\d]/g, '');
  
    // Verifica se o CNPJ tem 14 dígitos
    if (cnpj.length !== 14) return false;
  
    // Cálculo dos dígitos verificadores
    const calcDigit = (cnpj: string, length: number, multiplier: number) => {
      let sum = 0;
      for (let i = 0; i < length; i++) {
        sum += parseInt(cnpj[i]) * (multiplier - i);
      }
      const remainder = (sum % 11);
      return remainder < 2 ? 0 : 11 - remainder;
    };
  
    const firstDigit = calcDigit(cnpj, 12, 5);
    const secondDigit = calcDigit(cnpj, 13, 6);
  
    return cnpj[12] == firstDigit && cnpj[13] == secondDigit;
  }
  