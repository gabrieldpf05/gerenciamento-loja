export function validateCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]/g, '');

  if (cnpj.length !== 14) return false;

  const calcDigit = (cnpj: string, length: number, multiplier: number) => {
    let sum = 0;
    for (let i = 0; i < length; i++) {
      sum += parseInt(cnpj[i]) * (multiplier - i);
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstDigit = calcDigit(cnpj, 12, 5);
  const secondDigit = calcDigit(cnpj, 13, 6);

  return (
    cnpj[12] === firstDigit.toString() && cnpj[13] === secondDigit.toString()
  );
}
