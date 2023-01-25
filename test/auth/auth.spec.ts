import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createApp } from '../../src/main';
import request from 'supertest';
import { AuthModule } from '../../src/modules/auth/auth.module';
import { AppModule } from '../../src/app.module';

describe('Auth', () => {
  jest.setTimeout(1000 * 60 * 3);
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

  describe('Registration', () => {
    const testPayload = {
      login: 'Yurii',
      email: 'ovdey1999@gmail.com',
      password: '123456',
    };

    it('Successfully registration', async () => {
      await request(app.getHttpServer())
        .post('/auth/registration')
        .send(testPayload)
        .expect(204);
    });

    it('Shouldn`t register user with incorrect data', async () => {
      const testPayload = {
        login: 'Yuriidfgdgdfgdfg',
        email: 'ovdey~gmail.com',
        password: '123456',
      };
      await request(app.getHttpServer())
        .post('/auth/registration')
        .send(testPayload)
        .expect(400);
    });

    // it('Should throw error if user alredy exist', async () => {
    //   await createCorrectUser(app);
    //   await request(app.getHttpServer()).post('/auth/registration').send(testPayload).expect(400);
    // });
  });

  describe('Login', () => {});
});
