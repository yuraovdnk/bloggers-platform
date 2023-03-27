import { UsersRepository } from '../../src/modules/users/infrastructure/repository/users.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { configModule } from '../../src/app.module';
import { AuthModule } from '../../src/modules/auth/auth.module';
import { TestService } from '../../src/modules/testing/test.service';
import { add } from 'date-fns';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { User } from '../../src/modules/users/domain/entity/user.entity';

describe('recovery password', () => {
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
  it('should recovery password', async function () {
    const email = createdUser.email;
    const recoveryCode = uuid();
    const recoveryCodeExpire = add(new Date(), {
      hours: 1,
    });
    const user = await usersRepository.findByEmail(email);
    expect(user).toBeTruthy();
    user.recoverPassword(recoveryCode, recoveryCodeExpire);
    await usersRepository.save(user);
    expect(user.passwordRecoveryCode).toEqual(recoveryCode);
    expect(user.expirationPasswordRecoveryCode).toEqual(recoveryCodeExpire);
  });
  it('shouldn`t recovery password because email invalid', async function () {
    const email = 'ewfewf@gmail.com';

    const user = await usersRepository.findByEmail(email);
    expect(user).toBeNull();
  });
});
