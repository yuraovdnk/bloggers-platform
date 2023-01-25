import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/repository/users.repository';
import { NotFoundException } from '@nestjs/common';

export class RemoveUserCommand {
  constructor(public readonly userId: string) {}
}
@CommandHandler(RemoveUserCommand)
export class RemoveUserUseCase implements ICommandHandler<RemoveUserCommand> {
  constructor(private userRepository: UsersRepository) {}
  async execute(command: RemoveUserCommand): Promise<any> {
    const user = await this.userRepository.findById(command.userId);
    if (!user) {
      throw new NotFoundException();
    }
    await this.userRepository.remove(user);
  }
}
