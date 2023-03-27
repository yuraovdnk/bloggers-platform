import { Strategy } from 'passport-local';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { mapErrors } from '../../../../common/exceptions/mapErrors';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../../../users/infrastructure/repository/users.repository';
import { User } from '../../../users/domain/entity/user.entity';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor() {
    super();
  }
}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService, private usersRepository: UsersRepository) {
    super({
      usernameField: 'loginOrEmail',
      passwordField: 'password',
    });
  }

  async validate(loginOrEmail: string, password: string): Promise<any> {
    const candidate: User = await this.usersRepository.findByLoginOrEmail(loginOrEmail);
    if (!candidate || !candidate.canLogin()) throw new UnauthorizedException();

    const isValidPassword = await bcrypt.compare(password, candidate.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedException(mapErrors('login or password is not correct', 'auth'));
    }
    return candidate;
  }
}
