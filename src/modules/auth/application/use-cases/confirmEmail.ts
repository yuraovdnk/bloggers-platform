import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/repository/users.repository';
import { BadRequestException } from '@nestjs/common';
import { mapErrors } from '../../../../common/exceptions/mapErrors';

export class ConfirmEmailCommand {
  constructor(public readonly confirmCode: string) {}
}
@CommandHandler(ConfirmEmailCommand)
export class ConfirmEmailUseCase implements ICommandHandler<ConfirmEmailCommand> {
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: ConfirmEmailCommand): Promise<any> {
    const user = await this.usersRepository.findByConfirmCode(command.confirmCode);
    if (!user) {
      throw new BadRequestException(mapErrors('Code is incorrect', 'code'));
    }
    user.confirmEmail(command.confirmCode);
    await this.usersRepository.save(user);
  }
}
