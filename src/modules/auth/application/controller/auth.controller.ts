import { Body, Controller, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../../../users/application/dto/request/create-user.dto';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { Response } from 'express';
import {
  DeviceInfoType,
  DeviceMeta,
} from '../../../../common/decorators/device-meta.decotator';
import { LocalAuthGuard } from '../strategies/local.strategy';
import { JwtCookieGuard } from '../../../../common/guards/jwt-cookie.strategy';
import { JwtGuard } from '../../../../common/guards/jwt.strategy';
import { EmailDto } from '../dto/email.dto';
import { NewPasswordDto } from '../dto/new-password.dto';
import { Throttle } from '@nestjs/throttler';
import { CommandBus } from '@nestjs/cqrs';
import { SignUpCommand } from '../use-cases/signUp';
import { ResendConfirmCodeCommand } from '../use-cases/resendConfirmCode';
import { ConfirmEmailCommand } from '../use-cases/confirmEmail';
import { RecoveryPasswordCommand } from '../use-cases/recoveryPassword';
import { ChangePasswordCommand } from '../use-cases/changePassword';
import { GenerateTokensCommand } from '../use-cases/generateTokens';
import { UsersQueryRepository } from '../../../users/infrastructure/repository/users.query.repository';
import { SignOutCommand } from '../use-cases/signOut';
import { User } from '../../../users/domain/entity/user.entity';

@Throttle(5, 10)
@Controller('auth')
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  @Post('registration')
  @HttpCode(204)
  async registration(@Body() registrationDto: CreateUserDto): Promise<boolean> {
    return this.commandBus.execute(new SignUpCommand(registrationDto));
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  async confirmRegistration(@Body('code') confirmCode: string): Promise<boolean> {
    return this.commandBus.execute(new ConfirmEmailCommand(confirmCode));
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  async resendConfirmCode(@Body() emailDto: EmailDto): Promise<boolean> {
    return this.commandBus.execute(new ResendConfirmCodeCommand(emailDto.email));
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(
    @Res() res: Response,
    @CurrentUser() userId: string,
    @DeviceMeta() deviceInfo: DeviceInfoType,
  ) {
    const tokens = await this.commandBus.execute(
      new GenerateTokensCommand(deviceInfo, userId),
    );
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    res.status(200).send({ accessToken: tokens.accessToken });
  }

  @UseGuards(JwtCookieGuard)
  @Post('refresh-token')
  @HttpCode(200)
  async refreshToken(
    @Res() res: Response,
    @CurrentUser() userId: string,
    @DeviceMeta() deviceInfo: DeviceInfoType,
  ) {
    const tokens = await this.commandBus.execute(
      new GenerateTokensCommand(deviceInfo, userId),
    );
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    res.status(200).send({ accessToken: tokens.accessToken });
  }

  @UseGuards(JwtCookieGuard)
  @Post('logout')
  @HttpCode(204)
  async logout(
    @Res() res: Response,
    @CurrentUser() userId: string,
    @DeviceMeta() deviceInfo: DeviceInfoType,
  ): Promise<void> {
    await this.commandBus.execute(new SignOutCommand(userId, deviceInfo));
    res.clearCookie('refreshToken');
    res.sendStatus(204);
  }

  @Post('password-recovery')
  @HttpCode(204)
  async recoverPassword(@Body() emailDto: EmailDto): Promise<void> {
    return this.commandBus.execute(new RecoveryPasswordCommand(emailDto.email));
  }

  @Post('new-password')
  @HttpCode(204)
  async setNewPassword(@Body() newPasswordDto: NewPasswordDto): Promise<void> {
    return this.commandBus.execute(new ChangePasswordCommand(newPasswordDto));
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async infoAboutMe(@CurrentUser() userId: string): Promise<User> {
    return this.usersQueryRepository.getInfoByUserId(userId);
  }
}
