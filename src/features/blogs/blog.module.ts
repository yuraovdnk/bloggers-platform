import { forwardRef, Module } from '@nestjs/common';
import { BloggerBlogsController } from './infrastructure/controllers/blogger-blogs.controller';
import { CreateBlogUseCase } from './application/use-cases/commands/create-blog.use-case';
import { BlogsService } from './application/blogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './domain/blog.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { BlogsRepository } from './infrastructure/repository/blogs.repository';
import { BlogsQueryRepository } from './infrastructure/repository/blogs.query.repository';
import { UpdateBlogUseCase } from './application/use-cases/commands/update-blog.use-case';
import { DeleteBlogUseCase } from './application/use-cases/commands/delete-blog.use-case';
import { PostModule } from '../posts/post.module';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../users/user.module';
import { BlogsController } from './infrastructure/controllers/blogs.controller';
import { SaBlogsController } from './infrastructure/controllers/sa-blogs.controller';
import { CreatePostForBlogUseCase } from './application/use-cases/commands/create-post-for-blog.use-case';
import { UpdatePostUseCase } from './application/use-cases/commands/update-post.use-case';
import { DeletePostUseCase } from './application/use-cases/commands/delete-post.use-case';
import { BindBlogWithUserUseCase } from '../users/application/use-cases/bindBlogWithUser.use-case';

const useCases = [
  CreateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  CreatePostForBlogUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  BindBlogWithUserUseCase,
];
@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Blog]),
    UserModule,
    forwardRef(() => PostModule),
  ],
  controllers: [BloggerBlogsController, BlogsController, SaBlogsController],
  providers: [
    BlogsService,
    BlogsRepository,
    JwtService,
    ...useCases,
    {
      provide: BlogsQueryRepository.name,
      useClass: BlogsQueryRepository,
    },
  ],
  exports: [BlogsRepository],
})
export class BlogModule {
  constructor() {
    console.log('BlogModule init');
  }
}
