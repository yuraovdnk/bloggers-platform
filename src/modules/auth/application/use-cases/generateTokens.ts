import { v4 as uuid } from 'uuid';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../../infrastructure/repository/auth.repository';
import { DeviceInfoType } from '../../../../decorators/device-meta.decotator';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export class GenerateTokensCommand {
  constructor(readonly deviceInfo: DeviceInfoType, public readonly userId: string) {}
}
@CommandHandler(GenerateTokensCommand)
export class GenerateTokensUseCase implements ICommandHandler<GenerateTokensCommand> {
  constructor(
    private authRepository: AuthRepository,
    public configService: ConfigService,
    private jwtService: JwtService,
  ) {}
  async execute(command: GenerateTokensCommand): Promise<any> {
    const authSession = await this.authRepository.getByDeviceIdAndUserId(
      command.userId,
      command.deviceInfo.deviceId,
    );
    //If AuthSession not exist for user, then first login. Create him id device
    if (!authSession) {
      command.deviceInfo.deviceId = uuid();
    }
    const payload = { userId: command.userId, deviceId: command.deviceInfo.deviceId };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('secrets.secretAccessToken'),
      expiresIn: '10s',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('secrets.secretRefreshToken'),
      expiresIn: '20s',
    });
    //verify token to get signed time
    const decodedToken: any = this.jwtService.decode(refreshToken);
    const timeToken = {
      iat: new Date(decodedToken.iat * 1000),
      exp: new Date(decodedToken.exp * 1000),
    };
    //create AuthSession entity
    const createdAuthSession = await this.authRepository.create(
      command.userId,
      timeToken,
      command.deviceInfo,
    );
    //save via custom repository
    await this.authRepository.save(createdAuthSession);
    return {
      accessToken,
      refreshToken,
    };
  }
}
