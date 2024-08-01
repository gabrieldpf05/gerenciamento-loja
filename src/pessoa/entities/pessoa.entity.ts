import { ApiProperty } from '@nestjs/swagger';
import { Pessoa } from '@prisma/client';

export class PessoaEntity implements Pessoa {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  cpf: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
