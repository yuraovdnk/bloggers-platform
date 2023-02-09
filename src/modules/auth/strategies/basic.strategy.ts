import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BasicAuthGuard extends AuthGuard('basic') {
  constructor() {
    super();
    console.log('init basic');
  }
}

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy, 'basic') {
  constructor(private configService: ConfigService) {
    console.log('AUTH GUARD init');
    super({
      passReqToCallback: true,
    });
  }

  public validate = async (req, username, password) => {
    const isValidUserName = this.configService.get('admin.userName') === username;
    const isValidUserPassword = this.configService.get('admin.password') === password;
    if (isValidUserName && isValidUserPassword) {
      return true;
    }
    throw new UnauthorizedException();
  };
}
