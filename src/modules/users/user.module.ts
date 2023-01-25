import { Module } from '@nestjs/common';
import { UsersController } from './infrastructure/controller/users.controller';
import { UsersRepository } from './infrastructure/repository/users.repository';
import { UsersQueryRepository } from './infrastructure/repository/users.query.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';
import { CreateUserUseCase } from './application/use-cases/createUser';
import { CqrsModule } from '@nestjs/cqrs';
import { RemoveUserUseCase } from './application/use-cases/removeUser';

const useCases = [CreateUserUseCase, RemoveUserUseCase];
@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersRepository, UsersQueryRepository, ...useCases],
  exports: [UsersRepository],
})
export class UserModule {}
