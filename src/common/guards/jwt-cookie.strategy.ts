import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from '../../modules/auth/infrastructure/repository/auth.repository';
import { UsersRepository } from '../../modules/users/infrastructure/repository/users.repository';

@Injectable()
export class JwtCookieGuard extends AuthGuard('jwt-cookie') {
  constructor() {
    super();
  }
}

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(Strategy, 'jwt-cookie') {
  constructor(
    private usersRepository: UsersRepository,
    private authRepository: AuthRepository,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: (req) => {
        return req.cookies.refreshToken;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('secrets.secretRefreshToken'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const user = await this.usersRepository.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    const session = await this.authRepository.getByDeviceIdAndUserId(
      user.id,
      payload.deviceId,
    );

    if (!session) {
      throw new UnauthorizedException();
    }
    //if jwt passport to pass expired token, then throw error
    if (
      session.issuedAt.getTime() !== new Date(payload.iat * 1000).getTime() ||
      session.expiresAt.getTime() !== new Date(payload.exp * 1000).getTime()
    ) {
      throw new UnauthorizedException();
    }
    return { ...user, deviceId: payload.deviceId };
  }
}
