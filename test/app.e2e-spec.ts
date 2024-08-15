import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';

describe('ProductController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/products (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Cimento', supplierIds: [1] })
      .expect(201);

    expect(response.body).toHaveProperty('name', 'Cimento');
    expect(response.body).toHaveProperty('qrCode');
  });
  afterAll(async () => {
    await app.close();
  });
});
