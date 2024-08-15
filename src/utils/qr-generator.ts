import QRCode from 'qrcode';

export async function generateQRCode(
  code: string,
  productName: string,
  supplierCNPJ: string,
): Promise<string> {
  const qrData = `Produto: ${productName}\nCódigo: ${code}\nCNPJ do Fornecedor: ${supplierCNPJ}`;
  try {
    const qrCodeUrl = await QRCode.toDataURL(qrData);
    return qrCodeUrl;
  } catch (error) {
    throw new Error('Erro ao gerar QR Code');
  }
}
