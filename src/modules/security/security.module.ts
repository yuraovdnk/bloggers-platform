import { Module } from '@nestjs/common';
import { SecurityController } from './infrastructure/controller/security.controller';
import { JwtCookieGuard } from '../../common/guards/jwt-cookie.strategy';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';

import { SecurityService } from './application/security.service';

@Module({
  imports: [CqrsModule, AuthModule],
  exports: [],
  providers: [JwtCookieGuard, JwtService, SecurityService],
  controllers: [SecurityController],
})
export class SecurityModule {}
