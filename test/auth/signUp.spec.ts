import { UsersRepository } from '../../src/modules/users/infrastructure/repository/users.repository';
import { Test } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';
import { add } from 'date-fns';
import * as bcrypt from 'bcrypt';
import { configModule } from '../../src/app.module';
import { AuthModule } from '../../src/modules/auth/auth.module';
import { TestService } from '../../src/modules/testing/test.service';

describe('sign up use-cse', () => {
  let usersRepository: UsersRepository;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [configModule, AuthModule],
      providers: [TestService],
    }).compile();
    usersRepository = module.get<UsersRepository>(UsersRepository);
    await module.get(TestService).clearDb();
  });

  it('should create user in confirmed', async function () {
    const passwordHash = await bcrypt.hash('123456', 10);
    const mock = {
      login: 'log',
      email: 'dfd@gmail.com',
      passwordHash,
      confirmationCode: uuid(),
      expirationConfirmCode: add(new Date(), {
        hours: 1,
      }),
      isConfirmedEmail: false,
    };
    const createdUser = await usersRepository.create(mock);
    expect(createdUser.isConfirmedEmail).toBeFalsy();
  });
});
