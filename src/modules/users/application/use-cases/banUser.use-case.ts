import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/repository/users.repository';
import { NotFoundException } from '@nestjs/common';

export class BanUserCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly banReason: string,
    public readonly isBanned: boolean,
  ) {}
}

@CommandHandler(BanUserCommand)
export class BanUserUseCase implements ICommandHandler {
  constructor(private userRepository: UsersRepository) {}
  async execute(command: BanUserCommand) {
    const user = await this.userRepository.findById(command.userId);
    if (!user) throw new NotFoundException();
    if (command.isBanned) {
      return await this.userRepository.banUser(
        command.userId,
        command.banReason,
        command.isBanned,
      );
    }
    return this.userRepository.unBanUser(command.userId);
  }
}
