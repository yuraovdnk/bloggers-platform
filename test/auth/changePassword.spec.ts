import { UsersRepository } from '../../src/modules/users/infrastructure/repository/users.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { configModule } from '../../src/app.module';
import { AuthModule } from '../../src/modules/auth/auth.module';
import { TestService } from '../../src/modules/testing/test.service';
import { User } from '../../src/modules/users/domain/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { add } from 'date-fns';

describe('new password', () => {
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
  it('should ', async function () {
    const user = await usersRepository.findByEmail(createdUser.email);
    expect(user).toBeTruthy();
    const recoveryCode = uuid();
    const recoveryCodeExpire = add(new Date(), {
      hours: 1,
    });
    user.recoverPassword(recoveryCode, recoveryCodeExpire);
    await usersRepository.save(user);
    const userByCode = await usersRepository.findByRecoveryCode(recoveryCode);
    expect(userByCode).toBeTruthy();
    const newPassword = '123456';
    await user.changePassword(newPassword);
    await usersRepository.save(user);
    const validPassword = await bcrypt.compare(newPassword, user.passwordHash);
    expect(validPassword).toBeTruthy();
  });
});
