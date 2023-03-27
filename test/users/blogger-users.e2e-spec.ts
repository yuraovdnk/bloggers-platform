import { INestApplication, Logger } from '@nestjs/common';
import { UsersRepository } from '../../src/modules/users/infrastructure/repository/users.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { TestService } from '../../src/modules/testing/test.service';
import { createApp } from '../../src/main';
import { v4 as uuid } from 'uuid';
import { add } from 'date-fns';
import request from 'supertest';

describe('SA-Users', () => {
  let app: INestApplication;
  let usersRepository: UsersRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [TestService],
    }).compile();
    app = moduleFixture.createNestApplication();
    app = await createApp(app);
    app.useLogger(new Logger());
    await app.init();

    usersRepository = moduleFixture.get<UsersRepository>(UsersRepository);

    await moduleFixture.get(TestService).clearDb();
  });
  it('should ban user', async function () {
    const createdUser = await usersRepository.create({
      login: 'login',
      email: '12345@gmail.com',
      passwordHash: 'hash',
      confirmationCode: uuid(),
      expirationConfirmCode: add(new Date(), {
        hours: 1,
      }),
      isConfirmedEmail: true,
    });
    await request(app.getHttpServer())
      .put('/sa/users/' + createdUser.id + '/ban')
      .send({ isBanned: true, banReason: 'becausebecfdsfsdfsdfsdfsdfs' })
      .auth('admin', 'qwerty')
      .expect(204);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        login: 'login',
        email: '12345@gmail.com',
      })
      .expect(401);
  });
});
