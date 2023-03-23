import { forwardRef, Module } from '@nestjs/common';
import { CommentsController } from './application/controller/public/comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './domain/entity/comment.entity';
import { CreateCommentUseCase } from './application/use-cases/commands/create-comment.use-case';
import { UpdateCommentUseCase } from './application/use-cases/commands/update-comment.use-case';
import { DeleteCommentUseCase } from './application/use-cases/commands/delete-comment.use-case';
import { CqrsModule } from '@nestjs/cqrs';
import { PostModule } from '../posts/post.module';
import { UserModule } from '../users/user.module';
import { JwtService } from '@nestjs/jwt';
import { CommentsRepository } from './infrastructure/repository/comments.repository';
import { CommentsQueryRepository } from './infrastructure/repository/comments.query.repository';
import { SetLikeStatusForCommentUseCase } from './application/use-cases/commands/set-like-comment.use-case';
import { LikesRepository } from '../likes/infrastructure/likes.repository';
import { Like } from '../likes/domain/like.entity';

const useCases = [
  CreateCommentUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
  SetLikeStatusForCommentUseCase,
];
@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Comment, Like]),
    forwardRef(() => PostModule),
    forwardRef(() => UserModule),
  ],
  controllers: [CommentsController],
  providers: [
    ...useCases,
    CommentsRepository,
    LikesRepository,
    CommentsQueryRepository,
    JwtService,
  ],
  exports: [CommentsQueryRepository],
})
export class CommentModule {
  constructor() {
    console.log('CommentModule init');
  }
}
