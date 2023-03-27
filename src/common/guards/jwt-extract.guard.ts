import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../../modules/users/infrastructure/repository/users.repository';

@Injectable()
export class JwtExtractGuard implements CanActivate {
  constructor(
    private usersRepo: UsersRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      request.user = { id: null };
      return true;
    }

    const token: string = request.headers.authorization.split(' ')[1];
    let userId = null;
    try {
      const result = this.jwtService.verify(token, {
        secret: this.configService.get('secrets.secretAccessToken'),
      });
      userId = result.userId;
    } catch (e) {
      request.user = { id: null };
      return true;
    }

    const user = await this.usersRepo.findById(userId);
    request.user = user;

    return true;
  }
}
