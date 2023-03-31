import { forwardRef, Module } from '@nestjs/common';
import { SaUsersController } from './application/controllers/admin/sa-users.controller';
import { UsersRepository } from './infrastructure/repository/users.repository';
import { UsersQueryRepository } from './infrastructure/repository/users.query.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entity/user.entity';
import { CreateUserUseCase } from './application/use-cases/createUser';
import { CqrsModule } from '@nestjs/cqrs';
import { RemoveUserUseCase } from './application/use-cases/removeUser';
import { UsersService } from './application/users.service';
import { BasicStrategy } from '../auth/application/strategies/basic.strategy';
import { UsersBanList } from './domain/entity/userBanList.entity';
import { BanUserUseCase } from './application/use-cases/banUser.use-case';
import { BloggerUsersController } from './application/controllers/blogger/blogger.users.controller';
import { BanUserForBlogUseCase } from './application/use-cases/banUserForBlog.use-case';
import { BlogModule } from '../blogs/blog.module';

const useCases = [
  CreateUserUseCase,
  RemoveUserUseCase,
  BanUserUseCase,
  BanUserForBlogUseCase,
];
@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([User, UsersBanList]),
    forwardRef(() => BlogModule),
  ],
  controllers: [SaUsersController, BloggerUsersController],
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
