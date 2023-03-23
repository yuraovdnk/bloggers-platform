import { Module } from '@nestjs/common';
import { AuthController } from './application/controller/auth.controller';
import { AuthService } from './application/auth.service';
import { LocalStrategy } from './application/strategies/local.strategy';
import { SignUpUseCase } from './application/use-cases/signUp';
import { EmailService } from '../../adapters/notification/email.service';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './infrastructure/repository/auth.repository';
import { ResendConfirmCodeUseCase } from './application/use-cases/resendConfirmCode';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthSession } from './domain/entity/authSession.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfirmEmailUseCase } from './application/use-cases/confirmEmail';
import { RecoveryPasswordUseCase } from './application/use-cases/recoveryPassword';
import { ChangePasswordUseCase } from './application/use-cases/changePassword';
import { GenerateTokensUseCase } from './application/use-cases/generateTokens';
import { JwtCookieStrategy } from '../../common/guards/jwt-cookie.strategy';
import { JwtStrategy } from '../../common/guards/jwt.strategy';
import { SignOutUseCase } from './application/use-cases/signOut';
import { DatabaseModule } from '../../adapters/database/database.module';
import { UserModule } from '../users/user.module';

const useCases = [
  SignUpUseCase,
  ResendConfirmCodeUseCase,
  ConfirmEmailUseCase,
  RecoveryPasswordUseCase,
  ChangePasswordUseCase,
  GenerateTokensUseCase,
  SignOutUseCase,
];
@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([AuthSession]), CqrsModule, UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    JwtCookieStrategy,
    AuthRepository,
    EmailService,
    JwtService,
    ...useCases,
  ],
  exports: [AuthRepository],
})
export class AuthModule {
  constructor() {
    console.log('AuthModule init');
  }
}
