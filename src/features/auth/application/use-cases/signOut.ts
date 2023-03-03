import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceInfoType } from '../../../../common/decorators/device-meta.decotator';
import { AuthRepository } from '../../infrastructure/repository/auth.repository';
import { UnauthorizedException } from '@nestjs/common';

export class SignOutCommand {
  constructor(public readonly userId: string, public readonly deviceInfo: DeviceInfoType) {}
}
@CommandHandler(SignOutCommand)
export class SignOutUseCase implements ICommandHandler<SignOutCommand> {
  constructor(private authRepository: AuthRepository) {}

  async execute(command: SignOutCommand): Promise<any> {
    const session = await this.authRepository.getByDeviceIdAndUserId(
      command.userId,
      command.deviceInfo.deviceId,
    );
    if (!session) {
      throw new UnauthorizedException();
    }
    await this.authRepository.remove(session);
  }
}
