import { UsersRepository } from '../../src/modules/users/infrastructure/repository/users.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { configModule } from '../../src/app.module';
import { AuthModule } from '../../src/modules/auth/auth.module';
import { TestService } from '../../src/modules/testing/test.service';
import { User } from '../../src/modules/users/domain/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { add } from 'date-fns';

describe('resend code', () => {
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
    console.log(await usersRepository.findByLoginOrEmail('dfd@gmail.com'), '1');
    console.log(await usersRepository.findByLoginOrEmail('login'), '2');
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

  it('should change confirm code', async function () {
    const email = createdUser.email;
    const user = await usersRepository.findByEmail(email);
    expect(user).toBeTruthy();
    const newConfirmCode = uuid();
    const newConfirmCodeExpiration = add(new Date(), {
      hours: 1,
    });
    user.updateConfirmCode(newConfirmCode, newConfirmCodeExpiration);
    await usersRepository.save(user);

    expect(user.confirmCode).toEqual(newConfirmCode);
    expect(user.expirationConfirmCode).toEqual(newConfirmCodeExpiration);
  });
});
