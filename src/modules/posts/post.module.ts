import { forwardRef, Module } from '@nestjs/common';
import { PostsController } from './infrastructure/controller/posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './domain/post.entity';
import { JwtExtractGuard } from '../../common/guards/jwt-extract.guard';
import { CqrsModule } from '@nestjs/cqrs';
import { CreatePostUseCase } from './application/use-cases/commands/create-post.use-case';
import { CreatePostForBlogUseCase } from '../blogs/application/use-cases/commands/create-post-for-blog.use-case';
import { BlogModule } from '../blogs/blog.module';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../users/user.module';
import { PostsRepository } from './infrastructure/repository/posts.repository';
import { PostsQueryRepository } from './infrastructure/repository/posts.query.repository';
import { UpdatePostUseCase } from './application/use-cases/commands/update-post.use-case';
import { DeletePostUseCase } from './application/use-cases/commands/delete-post.use-case';
import { Like } from '../likes/domain/like.entity';
import { SetLikeStatusForPostUseCase } from './application/use-cases/commands/set-likeStatus-for-post.use-case';
import { LikesRepository } from '../likes/infrastructure/likes.repository';
import { CommentModule } from '../comments/comment.module';

const useCases = [
  CreatePostUseCase,
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
    UserModule,
    forwardRef(() => CommentModule),
  ],
  controllers: [PostsController],
  providers: [
    ...useCases,
    LikesRepository,
    PostsRepository,
    PostsQueryRepository,
    JwtExtractGuard,
    JwtService,
  ],
  exports: [PostsRepository, PostsQueryRepository],
})
export class PostModule {}
