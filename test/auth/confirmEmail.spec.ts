import { Test, TestingModule } from '@nestjs/testing';
import { configModule } from '../../src/app.module';
import { AuthModule } from '../../src/modules/auth/auth.module';
import { UsersRepository } from '../../src/modules/users/infrastructure/repository/users.repository';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { add } from 'date-fns';
import { TestService } from '../../src/modules/testing/test.service';
import { User } from '../../src/modules/users/domain/entity/user.entity';

describe('shoul confirm Email', () => {
  let usersRepository: UsersRepository;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [configModule, AuthModule],
      providers: [TestService],
    }).compile();
    usersRepository = module.get<UsersRepository>(UsersRepository);
    await module.get(TestService).clearDb();
  });

  let createdUser: User = null;
  beforeEach(async () => {
    await module.get(TestService).clearDb();
    const userMock = {
      login: 'login',
      email: 'dfd@gmail.com',
      passwordHash: await bcrypt.hash('123456', 10),
      confirmationCode: uuid(),
      expirationConfirmCode: add(new Date(), {
        hours: 1,
      }),
      isConfirmedEmail: false,
    };
    createdUser = await usersRepository.create(userMock);
  });

  it('should confirm ', async function () {
    const user = await usersRepository.findByConfirmCode(createdUser.confirmCode);
    user.confirmEmail(user.confirmCode);
    await usersRepository.save(user);
    expect(user.isConfirmedEmail).toBeTruthy();
    expect(user.confirmCode).toBeNull();
    expect(user.expirationConfirmCode).toBeNull();
  });

  it('shouldn`t confirm because code invalid ', async function () {
    const user = await usersRepository.findByConfirmCode(uuid());
    expect(user).toBeNull();
  });

  it('shouldn`t confirm because code is expired ', async function () {
    const user = await usersRepository.findByConfirmCode(createdUser.confirmCode);
    const expirationCode = user.expirationConfirmCode > new Date();
    expect(expirationCode).toBeTruthy();
  });
});
