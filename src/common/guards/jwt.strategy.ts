import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@nestjs/config';
import { UsersRepository } from '../../modules/users/infrastructure/repository/users.repository';
import { IUser } from '../../modules/users/domain/entities/IUser';
import { AuthRepository } from '../../modules/auth/infrastructure/repository/auth.repository';
import { log } from 'util';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
    console.log('JwtGuard');
  }
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    protected usersRepository: UsersRepository,
    private authRepository: AuthRepository,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('secrets.secretAccessToken'),
    });
  }

  async validate(payload: any): Promise<IUser> {
    const session = await this.authRepository.getByDeviceIdAndUserId(
      payload.userId,
      payload.deviceId,
    );
    if (!session) throw new UnauthorizedException();

    if (
      session.issuedAt.getTime() !== new Date(payload.iat * 1000).getTime() &&
      session.expiresAt.getTime() !== new Date(payload.exp * 1000).getTime()
    )
      throw new UnauthorizedException();

    const user = await this.usersRepository.findById(payload.userId);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
