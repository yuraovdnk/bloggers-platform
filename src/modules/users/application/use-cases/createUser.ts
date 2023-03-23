import { CreateUserDto } from '../dto/request/create-user.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/repository/users.repository';
import { BadRequestException } from '@nestjs/common';
import { mapErrors } from '../../../../common/exceptions/mapErrors';
import * as bcrypt from 'bcrypt';

export class CreateUserCommand {
  constructor(public readonly createUserDto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(private userRepository: UsersRepository) {}
  async execute(command: CreateUserCommand): Promise<string> {
    const [userByEmail, userByLogin] = await Promise.all([
      this.userRepository.findByEmail(command.createUserDto.email),
      this.userRepository.findByLogin(command.createUserDto.login),
    ]);

    if (userByEmail || userByLogin) {
      throw new BadRequestException(mapErrors('user is exist', 'login or email'));
    }
    const passwordHash = await bcrypt.hash(command.createUserDto.password, 10);
    const newUser = {
      login: command.createUserDto.login,
      email: command.createUserDto.email,
      passwordHash,
      createdAt: new Date(),
      isConfirmedEmail: true,
    };
    const createdUser = await this.userRepository.create(newUser);
    return createdUser.id;
  }
}
