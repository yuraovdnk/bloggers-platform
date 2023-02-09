import { v4 as uuid } from 'uuid';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type DeviceInfoType = {
  deviceId: string | null;
  deviceName: string;
  ip: string;
};
export const DeviceMeta = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): DeviceInfoType => {
    const request = ctx.switchToHttp().getRequest();
    return {
      deviceId: request.user.deviceId ?? uuid(),
      deviceName: request.headers['user-agent'],
      ip: request.ip,
    };
  },
);
