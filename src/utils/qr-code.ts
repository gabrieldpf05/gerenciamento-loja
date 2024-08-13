import QRCode from 'qrcode';

export async function generateQRCode(productCode: string, productName: string, supplierCnpj: string): Promise<string> {
  const qrContent = `${productCode}${productName}${supplierCnpj}`;
  try {
    const qrCode = await QRCode.toDataURL(qrContent);
    return qrCode;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

