import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../../infrastructure/repository/auth.repository';
import { DeviceInfoType } from '../../../../common/decorators/device-meta.decotator';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';

export class GenerateTokensCommand {
  constructor(readonly deviceInfo: DeviceInfoType, public readonly userId: string) {}
}
@CommandHandler(GenerateTokensCommand)
export class GenerateTokensUseCase implements ICommandHandler<GenerateTokensCommand> {
  constructor(
    private authRepository: AuthRepository,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}
  async execute(command: GenerateTokensCommand): Promise<any> {
    const signedTokens = this.authService.generateTokens(
      command.userId,
      command.deviceInfo.deviceId,
    );

    const decodedToken: any = this.jwtService.decode(signedTokens.refreshToken);
    const timeToken = {
      iat: new Date(decodedToken.iat * 1000),
      exp: new Date(decodedToken.exp * 1000),
    };

    const authSession = await this.authRepository.getByDeviceIdAndUserId(
      command.userId,
      command.deviceInfo.deviceId,
    );
    if (!authSession) {
      await this.authRepository.create(command.userId, timeToken, command.deviceInfo);
      return signedTokens;
    }
    authSession.refreshAuthSession(command.deviceInfo.deviceId, timeToken);
    await this.authRepository.save(authSession);
    return signedTokens;
  }
}
