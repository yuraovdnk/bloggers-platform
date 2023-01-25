import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthRepository } from '../../auth/infrastructure/repository/auth.repository';
@Injectable()
export class SecurityService {
  constructor(private authRepository: AuthRepository) {}

  async terminateAll(deviceId: string, userId: string) {
    return this.authRepository.removeAll(deviceId, userId);
  }

  async terminateSessionByDeviceId(deviceId: string, userId: string) {
    const session = await this.authRepository.getByDeviceId(deviceId);
    if (!session) {
      throw new NotFoundException();
    }
    if (session.userId !== userId) {
      throw new ForbiddenException();
    }
    await this.authRepository.remove(session);
  }
}
