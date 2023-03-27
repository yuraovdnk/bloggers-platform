import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/repository/users.repository';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { add } from 'date-fns';
import { EmailService } from '../../../../adapters/notification/email.service';
import { mapErrors } from '../../../../common/exceptions/mapErrors';

export class ResendConfirmCodeCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(ResendConfirmCodeCommand)
export class ResendConfirmCodeUseCase implements ICommandHandler<ResendConfirmCodeCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private emailManager: EmailService,
  ) {}

  async execute(command: ResendConfirmCodeCommand): Promise<any> {
    const user = await this.usersRepository.findByEmail(command.email);
    if (!user || user.isConfirmedEmail) {
      throw new BadRequestException(mapErrors('Something went wrong', 'email'));
    }

    const newConfirmCode = uuid();
    const expirationConfirmCode = add(new Date(), {
      hours: 1,
    });

    user.updateConfirmCode(newConfirmCode, expirationConfirmCode);

    await this.usersRepository.save(user);

    try {
      await this.emailManager.sendConfirmMail(user);
    } catch (e) {
      throw new InternalServerErrorException();
    }
    return true;
  }
}
