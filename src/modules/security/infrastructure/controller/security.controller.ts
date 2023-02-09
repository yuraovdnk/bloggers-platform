import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../../decorators/current-user.decorator';
import { DeviceInfoType, DeviceMeta } from '../../../../decorators/device-meta.decotator';
import { JwtCookieGuard } from '../../../../common/guards/jwt-cookie.strategy';
import { AuthRepository } from '../../../auth/infrastructure/repository/auth.repository';
import { AuthSession } from '../../../auth/domain/authSession.entity';
import { SecurityService } from '../../application/security.service';

@Controller('security')
export class SecurityController {
  constructor(
    private authRepository: AuthRepository,
    private securityService: SecurityService,
  ) {}

  @UseGuards(JwtCookieGuard)
  @Get('devices')
  async getAllDevices(@CurrentUser() userId: string): Promise<AuthSession[]> {
    return this.authRepository.getByUserId(userId);
  }

  @UseGuards(JwtCookieGuard)
  @Delete('devices')
  @HttpCode(204)
  async terminateSessions(
    @CurrentUser() userId: string,
    @DeviceMeta() deviceInfo: DeviceInfoType,
  ) {
    return this.securityService.terminateAll(deviceInfo.deviceId, userId);
  }

  @UseGuards(JwtCookieGuard)
  @Delete('devices/:deviceId')
  @HttpCode(204)
  async terminateSessionByDeviceId(
    @CurrentUser() userId: string,
    @Param('deviceId', ParseUUIDPipe) deviceId: string,
  ) {
    return this.securityService.terminateSessionByDeviceId(deviceId, userId);
  }
}
