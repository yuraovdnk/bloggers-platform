import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from '../../../users/dto/create-user.dto';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { mapErrors } from '../../../../exceptions/mapErrors';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { add } from 'date-fns';
import { EmailService } from '../../../../adapters/notification/email.service';
import { UserInputType } from '../../../users/typing/user.types';
import { UsersRepository } from '../../../users/infrastructure/repository/users.repository';

export class SignUpCommand {
  constructor(readonly registrationDto: CreateUserDto) {}
}

@CommandHandler(SignUpCommand)
export class SignUpUseCase implements ICommandHandler<SignUpCommand> {
  constructor(
    private emailManager: EmailService,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: SignUpCommand): Promise<boolean> {
    const [userByEmail, userByLogin] = await Promise.all([
      this.usersRepository.findByEmail(command.registrationDto.email),
      this.usersRepository.findByLogin(command.registrationDto.login),
    ]);
    if (userByEmail || userByLogin) {
      throw new BadRequestException(mapErrors('user is exist', 'login or email'));
    }
    const passwordHash = await bcrypt.hash(command.registrationDto.password, 10);

    const newUser: UserInputType = {
      login: command.registrationDto.login,
      email: command.registrationDto.email,
      passwordHash,
      confirmationCode: uuid(),
      expirationConfirmCode: add(new Date(), {
        hours: 1,
      }),
      isConfirmedEmail: false,
    };

    const createdUser = await this.usersRepository.create(newUser);

    try {
      await this.emailManager.sendConfirmMail(createdUser);
    } catch (e) {
      await this.usersRepository.remove(createdUser);
      throw new InternalServerErrorException();
    }
    return true;
  }
}
