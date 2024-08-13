import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Store Management API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // Supplier Endpoints

  it('/suppliers (POST)', () => {
    return request(app.getHttpServer())
      .post('/suppliers')
      .send({ name: 'Fornecedor ABC', cnpj: '12345678000195' })
      .expect(201);
  });

  it('/suppliers (GET)', () => {
    return request(app.getHttpServer())
      .get('/suppliers')
      .expect(200);
  });

  it('/suppliers/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/suppliers/1') // Use a valid ID or set up a fixture to insert a supplier before this test
      .expect(200);
  });

  it('/suppliers/:id (PUT)', () => {
    return request(app.getHttpServer())
      .put('/suppliers/1') // Use a valid ID or set up a fixture to insert a supplier before this test
      .send({ name: 'Fornecedor Atualizado' })
      .expect(200);
  });

  it('/suppliers/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/suppliers/1') // Use a valid ID or set up a fixture to insert a supplier before this test
      .expect(200);
  });

  // Product Endpoints

  it('/products (POST)', () => {
    return request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Produto XYZ', code: 'XYZ123', supplierId: '1' }) // Use a valid supplierId
      .expect(201);
  });

  it('/products (GET)', () => {
    return request(app.getHttpServer())
      .get('/products')
      .expect(200);
  });

  it('/products/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/products/1') // Use a valid ID or set up a fixture to insert a product before this test
      .expect(200);
  });

  it('/products/:id (PUT)', () => {
    return request(app.getHttpServer())
      .put('/products/1') // Use a valid ID or set up a fixture to insert a product before this test
      .send({ name: 'Produto Atualizado' })
      .expect(200);
  });

  it('/products/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/products/1') // Use a valid ID or set up a fixture to insert a product before this test
      .expect(200);
  });
});
