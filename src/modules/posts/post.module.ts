import { forwardRef, Module } from '@nestjs/common';
import { PostsController } from './application/controllers/public/posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './domain/entity/post.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { CreatePostForBlogUseCase } from '../blogs/application/use-cases/commands/create-post-for-blog.use-case';
import { BlogModule } from '../blogs/blog.module';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../users/user.module';
import { PostsRepository } from './infrastructure/repository/posts.repository';
import { PostsQueryRepository } from './infrastructure/repository/posts.query.repository';
import { UpdatePostUseCase } from '../blogs/application/use-cases/commands/update-post.use-case';
import { DeletePostUseCase } from '../blogs/application/use-cases/commands/delete-post.use-case';
import { Like } from '../likes/domain/like.entity';
import { SetLikeStatusForPostUseCase } from './application/use-cases/commands/set-likeStatus-for-post.use-case';
import { LikesRepository } from '../likes/infrastructure/likes.repository';
import { CommentModule } from '../comments/comment.module';
import { IsExistBlog } from '../../common/validators/isExistBlog';

const useCases = [
  CreatePostForBlogUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  SetLikeStatusForPostUseCase,
];
@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Post, Like]),
    forwardRef(() => BlogModule),
    forwardRef(() => UserModule),
    forwardRef(() => CommentModule),
  ],
  controllers: [PostsController],
  providers: [
    ...useCases,
    LikesRepository,
    PostsRepository,
    PostsQueryRepository,
    JwtService,
    IsExistBlog,
  ],
  exports: [PostsRepository, PostsQueryRepository],
})
export class PostModule {
  constructor() {
    console.log('PostModule init');
  }
}
