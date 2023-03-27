import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateCommentDto } from '../../../../comments/application/dto/create-comment.dto';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator';
import { QueryParamsDto } from '../../../../../common/dtos/query-params.dto';
import { JwtExtractGuard } from '../../../../../common/guards/jwt-extract.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCommentCommand } from '../../../../comments/application/use-cases/commands/create-comment.use-case';
import { JwtGuard } from '../../../../../common/guards/jwt.strategy';
import { ParseStatusLikeEnumPipe } from '../../../../../common/pipes/status-like-enum.pipe';
import { SetLikeStatusForPostCommand } from '../../use-cases/commands/set-likeStatus-for-post.use-case';
import { PostsQueryRepository } from '../../../infrastructure/repository/posts.query.repository';
import { StatusLike } from '../../../../../common/types/commonEnums';
import { CommentsQueryRepository } from '../../../../comments/infrastructure/repository/comments.query.repository';
import { PageDto } from '../../../../../common/utils/PageDto';
import { PostViewModel } from '../../dto/post-view.model';
import { CommentViewModel } from '../../../../comments/application/dto/comment-view.model';

@Controller('posts')
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository,
    private commandBus: CommandBus,
  ) {}
  //get posts
  @UseGuards(JwtExtractGuard)
  @Get()
  async getPosts(@Query() queryParams: QueryParamsDto, @CurrentUser() userId: string) {
    return this.postsQueryRepository.getAll(queryParams, userId);
  }

  //get blogs by id
  @UseGuards(JwtExtractGuard)
  @Get(':postId')
  async getPostById(
    @Param('postId', ParseUUIDPipe) postId: string,
    @CurrentUser() userId: string,
  ): Promise<PostViewModel> {
    const post = await this.postsQueryRepository.getById(postId, userId);

    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  //create comment for blogs
  @UseGuards(JwtGuard)
  @Post(':postId/comments')
  async createCommentForPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() userId: string,
  ): Promise<CommentViewModel> {
    const createdCommentId = await this.commandBus.execute(
      new CreateCommentCommand(userId, postId, createCommentDto),
    );
    return this.commentsQueryRepository.findById(createdCommentId, userId);
  }

  //get comments for blogs
  @UseGuards(JwtExtractGuard)
  @Get(':postId/comments')
  async getCommentsByPostId(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query() queryParams: QueryParamsDto,
    @CurrentUser() userId: string,
  ): Promise<PageDto<CommentViewModel>> {
    const comments = await this.commentsQueryRepository.findAllByPostId(
      postId,
      queryParams,
      userId,
    );
    if (!comments) throw new NotFoundException();
    return comments;
  }

  //like for blogs
  @UseGuards(JwtGuard)
  @Put(':postId/like-status')
  @HttpCode(204)
  async setLikeForPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body('likeStatus', ParseStatusLikeEnumPipe) likeStatus: StatusLike,
    @CurrentUser() userId: string,
  ) {
    return this.commandBus.execute(
      new SetLikeStatusForPostCommand(postId, likeStatus, userId),
    );
  }
}
