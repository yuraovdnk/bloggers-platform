import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/controller/auth.controller';
import { AuthService } from './application/auth.service';
import { BasicAuthGuard } from './strategies/basic.strategy';
import { LocalAuthGuard, LocalStrategy } from './strategies/local.strategy';
import { SignUpUseCase } from './application/use-cases/signUp';
import { EmailService } from '../../adapters/notification/email.service';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './infrastructure/repository/auth.repository';
import { ResendConfirmCodeUseCase } from './application/use-cases/resendConfirmCode';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthSession } from './domain/authSession.entity';
import { User } from '../users/domain/entities/user.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfirmEmailUseCase } from './application/use-cases/confirmEmail';
import { RecoveryPasswordUseCase } from './application/use-cases/recoveryPassword';
import { ChangePasswordUseCase } from './application/use-cases/changePassword';
import { GenerateTokensUseCase } from './application/use-cases/generateTokens';
import { JwtCookieStrategy } from '../../common/guards/jwt-cookie.strategy';
import { JwtGuard, JwtStrategy } from '../../common/guards/jwt.strategy';
import { UsersQueryRepository } from '../users/infrastructure/repository/users.query.repository';
import { SignOutUseCase } from './application/use-cases/signOut';
import { DatabaseModule } from '../../adapters/database/database.module';
import { UsersRepository } from '../users/infrastructure/repository/users.repository';

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
  imports: [DatabaseModule, TypeOrmModule.forFeature([AuthSession, User]), CqrsModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    BasicAuthGuard,
    LocalAuthGuard,
    JwtGuard,
    JwtStrategy,
    LocalStrategy,
    JwtCookieStrategy,
    AuthRepository,
    UsersRepository,
    UsersQueryRepository,
    EmailService,
    JwtService,
    ...useCases,
  ],
  exports: [AuthRepository],
})
export class AuthModule {}
