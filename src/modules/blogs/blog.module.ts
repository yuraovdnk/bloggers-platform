import { forwardRef, Module } from '@nestjs/common';
import { BloggerBlogsController } from './application/controllers/blogger/blogger-blogs.controller';
import { CreateBlogUseCase } from './application/use-cases/commands/create-blog.use-case';
import { BlogsService } from './application/blogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './domain/entity/blog.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { BlogsRepository } from './infrastructure/repository/blogs.repository';
import { BlogsQueryRepository } from './infrastructure/repository/blogs.query.repository';
import { UpdateBlogUseCase } from './application/use-cases/commands/update-blog.use-case';
import { DeleteBlogUseCase } from './application/use-cases/commands/delete-blog.use-case';
import { PostModule } from '../posts/post.module';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../users/user.module';
import { BlogsController } from './application/controllers/public/blogs.controller';
import { SaBlogsController } from './application/controllers/admin/sa-blogs.controller';
import { CreatePostForBlogUseCase } from './application/use-cases/commands/create-post-for-blog.use-case';
import { UpdatePostUseCase } from './application/use-cases/commands/update-post.use-case';
import { DeletePostUseCase } from './application/use-cases/commands/delete-post.use-case';
import { BindBlogWithUserUseCase } from './application/use-cases/commands/bindBlogWithUser.use-case';
import { BlogBanList } from './domain/entity/blogBanList.entity';
import { BanUserForBlogUseCase } from '../users/application/use-cases/banUserForBlog.use-case';
import { BanBlogUseCase } from './application/use-cases/commands/banBlog.use-case';
import { CommentModule } from '../comments/comment.module';

const useCases = [
  CreateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  CreatePostForBlogUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  BindBlogWithUserUseCase,
  BanUserForBlogUseCase,
  BanBlogUseCase,
];
@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Blog, BlogBanList]),
    forwardRef(() => UserModule),
    forwardRef(() => PostModule),
    forwardRef(() => CommentModule),
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
  exports: [BlogsRepository, BlogsQueryRepository.name],
})
export class BlogModule {
  constructor() {
    console.log('BlogModule init');
  }
}
