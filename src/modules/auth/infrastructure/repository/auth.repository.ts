import { Repository } from 'typeorm';
import { AuthSession } from '../../domain/entity/authSession.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceInfoType } from '../../../../common/decorators/device-meta.decotator';

@Injectable()
export class AuthRepository {
  constructor(@InjectRepository(AuthSession) private authEntity: Repository<AuthSession>) {}

  async create(
    userId: string,
    timeToken: { iat: Date; exp: Date },
    deviceInfo: DeviceInfoType,
  ): Promise<any> {
    const session = await this.authEntity.create({
      userId,
      deviceId: deviceInfo.deviceId,
      title: deviceInfo.deviceName,
      ip: deviceInfo.ip,
      issuedAt: timeToken.iat,
      expiresAt: timeToken.exp,
    });
    await this.authEntity.save(session);
    return session;
  }

  async remove(entity: AuthSession) {
    await this.authEntity.remove(entity);
  }

  async getByUserId(userId: string): Promise<AuthSession[]> {
    const authSessions = await this.authEntity
      .createQueryBuilder('auth')
      .select([
        'auth.ip as ip',
        'auth.title as title',
        'auth.issuedAt as "lastActiveDate"',
        'auth.deviceId as "deviceId"',
      ])
      .where('auth.userId = :userId', { userId })
      .getRawMany();
    return authSessions;
  }

  async removeAll(deviceId: string, userId: string): Promise<void> {
    await this.authEntity
      .createQueryBuilder()
      .delete()
      .from(AuthSession)
      .where('userId = :userId And deviceId != :deviceId', { userId, deviceId })
      .execute();
  }

  async getByDeviceIdAndUserId(userId: string, deviceId: string): Promise<AuthSession> {
    const authSession = await this.authEntity
      .createQueryBuilder('auth')
      .select('auth')
      .where('auth.userId = :userId', { userId })
      .andWhere('auth.deviceId = :deviceId', { deviceId })
      .getOne();
    return authSession;
  }

  async getByDeviceId(deviceId: string): Promise<AuthSession> {
    const authSessions = await this.authEntity
      .createQueryBuilder('auth')
      .select('auth')
      .where('auth.deviceId = :deviceId', { deviceId })
      .getOne();
    return authSessions;
  }

  async save(entity: AuthSession): Promise<void> {
    await this.authEntity.save(entity);
  }
}
