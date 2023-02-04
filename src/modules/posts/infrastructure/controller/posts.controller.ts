import {
  Body,
  Controller,
  Delete,
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
import { CreatePostDto } from '../../dto/create-post.dto';
import { UpdatePostDto } from '../../dto/update-post.dto';
import { CreateCommentDto } from '../../../comments/dto/create-comment.dto';
import { CurrentUser } from '../../../../decorators/current-user.decorator';
import { QueryParamsDto } from '../../../../common/pipes/query-params.dto';
import { JwtExtractGuard } from '../../../../common/guards/jwt-extract.guard';
import { CommandBus } from '@nestjs/cqrs';
import { DeletePostCommand } from '../../application/use-cases/commands/delete-post.use-case';
import { UpdatePostCommand } from '../../application/use-cases/commands/update-post.use-case';
import { CreatePostCommand } from '../../application/use-cases/commands/create-post.use-case';
import { CreateCommentCommand } from '../../../comments/application/use-cases/commands/create-comment.use-case';
import { JwtGuard } from '../../../../common/guards/jwt.strategy';
import { ParseStatusLikeEnumPipe } from '../../../../common/pipes/status-like-enum.pipe';
import { SetLikeStatusForPostCommand } from '../../application/use-cases/commands/set-likeStatus-for-post.use-case';
import { PostsQueryRepository } from '../repository/posts.query.repository';
import { StatusLike } from '../../../../common/types/commonEnums';
import { CommentsQueryRepository } from '../../../comments/infrastructure/repository/comments.query.repository';
import { PageDto } from '../../../../common/utils/PageDto';
import { PostViewModel } from '../../dto/post-view.model';
import { CommentViewModel } from '../../../comments/dto/comment-view.model';
import { BasicAuthGuard } from '../../../auth/strategies/basic.strategy';

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
  async getPosts(
    @Query() queryParams: QueryParamsDto,
    @CurrentUser() userId: string,
  ): Promise<PageDto<PostViewModel>> {
    return this.postsQueryRepository.findAll(queryParams, userId);
  }

  //get post by id
  @UseGuards(JwtExtractGuard)
  @Get(':postId')
  async getPostById(
    @Param('postId', ParseUUIDPipe) postId: string,
    @CurrentUser() userId: string,
  ): Promise<PostViewModel> {
    const post = await this.postsQueryRepository.findById(postId, userId);
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  //create post
  @UseGuards(BasicAuthGuard)
  @Post()
  async createPost(@Body() createPostDto: CreatePostDto): Promise<PostViewModel> {
    const createdPostId = await this.commandBus.execute(
      new CreatePostCommand(createPostDto),
    );
    return this.postsQueryRepository.findById(createdPostId);
  }

  //update post
  @UseGuards(BasicAuthGuard)
  @Put(':postId')
  @HttpCode(204)
  async updatePost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<boolean> {
    return this.commandBus.execute(new UpdatePostCommand(postId, updatePostDto));
  }

  //delete post
  @UseGuards(BasicAuthGuard)
  @Delete(':postId')
  @HttpCode(204)
  async deletePost(@Param('postId', ParseUUIDPipe) postId: string): Promise<boolean> {
    return this.commandBus.execute(new DeletePostCommand(postId));
  }

  //create comment for post
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

  //get comments for post
  @UseGuards(JwtExtractGuard)
  @Get(':postId/comments')
  async getCommentsByPostId(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query() queryParams: QueryParamsDto,
    @CurrentUser() userId: string,
  ): Promise<PageDto<CommentViewModel>> {
    return this.commentsQueryRepository.findAllByPostId(postId, queryParams, userId);
  }

  //like for post
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
