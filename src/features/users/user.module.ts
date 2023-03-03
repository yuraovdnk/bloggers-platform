import { Module } from '@nestjs/common';
import { SaUsersController } from './infrastructure/controller/sa-users.controller';
import { UsersRepository } from './infrastructure/repository/users.repository';
import { UsersQueryRepository } from './infrastructure/repository/users.query.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';
import { CreateUserUseCase } from './application/use-cases/createUser';
import { CqrsModule } from '@nestjs/cqrs';
import { RemoveUserUseCase } from './application/use-cases/removeUser';
import { UsersService } from './application/users.service';
import { BasicStrategy } from '../auth/strategies/basic.strategy';
import { BanList } from './domain/entities/banList.entity';
import { BanUserUseCase } from './application/use-cases/banUser.use-case';

const useCases = [CreateUserUseCase, RemoveUserUseCase, BanUserUseCase];
@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([User, BanList])],
  controllers: [SaUsersController],
  providers: [
    UsersRepository,
    UsersQueryRepository,
    UsersService,
    ...useCases,
    BasicStrategy,
  ],
  exports: [UsersRepository, UsersQueryRepository],
})
export class UserModule {
  constructor() {
    console.log('UserModule init');
  }
}
