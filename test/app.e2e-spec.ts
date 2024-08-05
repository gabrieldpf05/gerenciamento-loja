import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('PessoaController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/pessoas (POST)', () => {
    return request(app.getHttpServer())
      .post('/pessoas')
      .send({
        nome: 'João Silva',
        cpf: '00000000000',
        email: 'joao.silva@example.com',
      })
      .expect(201);
  });

  it('/pessoas (GET)', () => {
    return request(app.getHttpServer()).get('/pessoas').expect(200);
  });

  it('/pessoas/:cpf (GET)', () => {
    return request(app.getHttpServer()).get('/pessoas/00000000000').expect(200);
  });

  it('/pessoas/:cpf (PUT)', () => {
    return request(app.getHttpServer())
      .put('/pessoas/00000000000')
      .send({ nome: 'João Silva Atualizado' })
      .expect(200);
  });

  it('/pessoas/:cpf (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/pessoas/00000000000')
      .expect(200);
  });
});
