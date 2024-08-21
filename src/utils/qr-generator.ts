import * as QRCode from 'qrcode';
import { HttpException, HttpStatus } from '@nestjs/common';

export async function generateQRCode(
  code: string,
  productName: string,
  supplierCNPJ: string,
): Promise<string> {
  try {
    const qrData = `Produto: ${productName}\nCódigo: ${code}\nCNPJ do Fornecedor: ${supplierCNPJ}`;
    return await QRCode.toDataURL(qrData);
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    throw new HttpException(
      'Erro interno ao gerar QR Code.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
