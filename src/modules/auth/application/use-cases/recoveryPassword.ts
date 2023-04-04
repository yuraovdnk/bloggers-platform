import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/repository/users.repository';
import { v4 as uuid } from 'uuid';
import { add } from 'date-fns';
import { InternalServerErrorException } from '@nestjs/common';
import { EmailService } from '../../../../adapters/notification/email.service';

export class RecoveryPasswordCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(RecoveryPasswordCommand)
export class RecoveryPasswordUseCase implements ICommandHandler<RecoveryPasswordCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private emailManager: EmailService,
  ) {}

  async execute(command: RecoveryPasswordCommand): Promise<any> {
    const user = await this.usersRepository.findByEmail(command.email);
    if (!user) return true;
    const newRecoveryCode = uuid();
    const expirationCode = add(new Date(), {
      hours: 1,
    });

    user.recoverPassword(newRecoveryCode, expirationCode);

    await this.usersRepository.save(user);

    try {
      await this.emailManager.sendRecoveryCode(user);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
