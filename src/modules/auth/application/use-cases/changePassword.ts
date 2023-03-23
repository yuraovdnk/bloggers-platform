import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NewPasswordDto } from '../dto/new-password.dto';
import { UsersRepository } from '../../../users/infrastructure/repository/users.repository';
import { NotFoundException } from '@nestjs/common';

export class ChangePasswordCommand {
  constructor(public readonly newPasswordDto: NewPasswordDto) {}
}
@CommandHandler(ChangePasswordCommand)
export class ChangePasswordUseCase implements ICommandHandler<ChangePasswordCommand> {
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: ChangePasswordCommand): Promise<any> {
    const user = await this.usersRepository.findByRecoveryCode(
      command.newPasswordDto.recoveryCode,
    );
    if (!user) throw new NotFoundException();
    await user.changePassword(command.newPasswordDto.newPassword);
    return this.usersRepository.save(user);
  }
}
