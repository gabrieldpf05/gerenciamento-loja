import QRCode from 'qrcode';
import { HttpException, HttpStatus } from '@nestjs/common';

export async function generateQRCode(
  code: string,
  productName: string,
  supplierCNPJ: string,
): Promise<string> {
  const qrData = `Produto: ${productName}\nCódigo: ${code}\nCNPJ do Fornecedor: ${supplierCNPJ}`;
  try {
    const qrCodeUrl = await QRCode.toDataURL(qrData);
    return qrCodeUrl;
  } catch (error: any) {
    if (error.message.includes('input too large')) {
      console.error(
        `Erro ao gerar QR Code: dados de entrada muito grandes. Detalhes: ${error.message}`,
      );
      throw new HttpException(
        {
          status: HttpStatus.PAYLOAD_TOO_LARGE,
          error: 'Erro ao gerar QR Code: dados de entrada muito grandes.',
          link: 'https://http.cat/413',
        },
        HttpStatus.PAYLOAD_TOO_LARGE,
      );
    } else if (error.message.includes('Invalid input data')) {
      console.error(
        `Erro ao gerar QR Code: dados de entrada inválidos. Detalhes: ${error.message}`,
      );
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'Erro ao gerar QR Code: dados de entrada inválidos.',
          link: 'https://http.cat/422',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else {
      console.error(`Erro ao gerar QR Code: ${error.message}`);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error:
            'Erro desconhecido ao gerar QR Code. Verifique os logs para mais detalhes.',
          link: 'https://http.cat/500',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
