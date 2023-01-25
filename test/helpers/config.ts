import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { createApp } from '../../src/main';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';

export function initTest() {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app = await createApp(app);
    await app.init();

    await request(app.getHttpServer()).delete('/testing/all-data').expect(204);
  });
  return app;
}
