import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UpdateBlogDto } from '../../dto/request/update-blog.dto';
import { QueryParamsDto } from '../../../../common/pipes/query-params.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../../application/use-cases/commands/create-blog.use-case';
import { CreateBlogDto } from '../../dto/request/create-blog.dto';
import { UpdateBlogCommand } from '../../application/use-cases/commands/update-blog.use-case';
import { DeleteBlogCommand } from '../../application/use-cases/commands/delete-blog.use-case';
import { CreatePostForBlogCommand } from '../../application/use-cases/commands/create-post-for-blog.use-case';
import { CreatePostForBlogDto } from '../../dto/request/create-post-for-blog.dto';
import { PostsQueryRepository } from '../../../posts/infrastructure/repository/posts.query.repository';
import { PageDto } from '../../../../common/utils/PageDto';
import { BlogViewModel } from '../../dto/response/blog-view.model';
import { PostViewModel } from '../../../posts/dto/post-view.model';
import { JwtGuard } from '../../../../common/guards/jwt.strategy';
import { UpdatePostDto } from '../../dto/request/update-post.dto';
import { UpdatePostCommand } from '../../application/use-cases/commands/update-post.use-case';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { DeletePostCommand } from '../../application/use-cases/commands/delete-post.use-case';
import { BlogsQueryRepository } from '../repository/blogs.query.repository';
import { IBloggerBlogsQueryRepository } from '../../types/interfaces/IBloggerBlogsQueryRepostory';

@Controller('blogger')
@UseGuards(JwtGuard)
export class BloggerBlogsController {
  constructor(
    @Inject(BlogsQueryRepository.name)
    private blogsQueryRepository: IBloggerBlogsQueryRepository,
    private commandBus: CommandBus,
    private postsQueryRepository: PostsQueryRepository,
  ) {
    console.log('BloggerBlogsController init');
  }

  //get all blogs
  @Get('blogs')
  async getAllBlogs(
    @Query() queryParams: QueryParamsDto,
    @CurrentUser() userId: string,
  ): Promise<PageDto<BlogViewModel>> {
    return this.blogsQueryRepository.findAllForBlogger(queryParams, userId);
  }

  //create blog
  @Post('blogs')
  async createBlog(
    @Body() createBlog: CreateBlogDto,
    @CurrentUser() userId: string,
  ): Promise<BlogViewModel> {
    const createdBlogId = await this.commandBus.execute(
      new CreateBlogCommand(createBlog, userId),
    );
    return this.blogsQueryRepository.findById(createdBlogId);
  }

  //update blog
  @Put('blogs/:blogId')
  @HttpCode(204)
  async updateBlog(
    @Param('blogId', ParseUUIDPipe) blogId: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @CurrentUser() userId: string,
  ): Promise<boolean> {
    return this.commandBus.execute(new UpdateBlogCommand(userId, blogId, updateBlogDto));
  }

  //delete blog
  @Delete('blogs/:blogId')
  @HttpCode(204)
  async deleteBlog(
    @Param('blogId', ParseUUIDPipe) blogId: string,
    @CurrentUser() userId: string,
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteBlogCommand(blogId, userId));
  }

  //create blogs for blog
  @Post('blogs/:blogId/posts')
  async createPostForBlog(
    @Param('blogId', ParseUUIDPipe) blogId: string,
    @Body() createPostDto: CreatePostForBlogDto,
    @CurrentUser() userId: string,
  ): Promise<PostViewModel> {
    const createdPostId = await this.commandBus.execute(
      new CreatePostForBlogCommand(blogId, createPostDto, userId),
    );
    return this.postsQueryRepository.getById(createdPostId);
  }

  //update blogs
  @Put('blogs/:blogId/posts/:postId')
  @HttpCode(204)
  updateBlogPost(
    @Param('blogId', ParseUUIDPipe) blogId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() userId: string,
  ) {
    return this.commandBus.execute(
      new UpdatePostCommand(userId, postId, blogId, updatePostDto),
    );
  }

  //delete blogs
  @Delete('blogs/:blogId/posts/:postId')
  @HttpCode(204)
  async deletePost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Param('blogId', ParseUUIDPipe) blogId: string,
    @CurrentUser() userId: string,
  ): Promise<boolean> {
    return this.commandBus.execute(new DeletePostCommand(postId, blogId, userId));
  }
}
