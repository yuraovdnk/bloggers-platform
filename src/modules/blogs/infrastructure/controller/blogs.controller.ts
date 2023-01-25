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
import { BlogsQueryRepository } from '../repository/blogs.query.repository';
import { UpdateBlogDto } from '../../dto/update-blog.dto';
import { QueryParamsDto } from '../../../../common/pipes/query-params.dto';
import { BasicAuthGuard } from '../../../auth/strategies/basic.strategy';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../../application/use-cases/commands/create-blog.use-case';
import { CreateBlogDto } from '../../dto/create-blog.dto';
import { UpdateBlogCommand } from '../../application/use-cases/commands/update-blog.use-case';
import { DeleteBlogCommand } from '../../application/use-cases/commands/delete-blog.use-case';
import { CreatePostForBlogCommand } from '../../application/use-cases/commands/create-post-for-blog.use-case';
import { CreatePostForBlogDto } from '../../dto/create-post-for-blog.dto';
import { PostsQueryRepository } from '../../../posts/infrastructure/repository/posts.query.repository';
import { JwtExtractGuard } from '../../../../common/guards/jwt-extract.guard';
import { CurrentUser } from '../../../../decorators/current-user.decorator';
import { PageDto } from '../../../../common/utils/PageDto';
import { BlogViewModel } from '../../dto/blog-view.model';
import { PostViewModel } from '../../../posts/dto/post-view.model';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private commandBus: CommandBus,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async getAllBlogs(@Query() queryParams: QueryParamsDto): Promise<PageDto<BlogViewModel>> {
    return this.blogsQueryRepository.findAll(queryParams);
  }

  @Get(':blogId')
  async getBlogById(@Param('blogId', ParseUUIDPipe) blogId: string): Promise<BlogViewModel> {
    const blog = await this.blogsQueryRepository.findById(blogId);
    if (!blog) {
      throw new NotFoundException();
    }
    return blog;
  }

  //@UseGuards(BasicAuthGuard)
  @Post()
  async createBlog(@Body() createBlog: CreateBlogDto): Promise<BlogViewModel> {
    const createdBlogId = await this.commandBus.execute(new CreateBlogCommand(createBlog));
    return this.blogsQueryRepository.findById(createdBlogId);
  }

  //@UseGuards(BasicAuthGuard)
  @Put(':blogId')
  @HttpCode(204)
  async updateBlog(
    @Param('blogId', ParseUUIDPipe) blogId: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<boolean> {
    return this.commandBus.execute(new UpdateBlogCommand(blogId, updateBlogDto));
  }

  //@UseGuards(BasicAuthGuard)
  @Delete(':blogId')
  @HttpCode(204)
  async deleteBlog(@Param('blogId', ParseUUIDPipe) blogId: string): Promise<boolean> {
    return this.commandBus.execute(new DeleteBlogCommand(blogId));
  }

  //@UseGuards(BasicAuthGuard)
  @Post(':blogId/posts')
  async createPostForBlog(
    @Param('blogId', ParseUUIDPipe) blogId: string,
    @Body() createPostDto: CreatePostForBlogDto,
  ): Promise<PostViewModel> {
    const createdPostId = await this.commandBus.execute(
      new CreatePostForBlogCommand(blogId, createPostDto),
    );
    return this.postsQueryRepository.findById(createdPostId);
  }

  //@UseGuards(JwtExtractGuard)
  @Get(':blogId/posts')
  async getPostsByBlogId(
    @Param('blogId', ParseUUIDPipe) blogId: string,
    @Query() queryParams: QueryParamsDto,
  ): Promise<PageDto<PostViewModel>> {
    return this.postsQueryRepository.findByBlogId(queryParams, blogId);
  }

  //@Get(':blogId/posts')
  //   async getPostsByBlogId(вооб
  //     @Param('blogId', ParseUUIDPipe) blogId: string,
  //     @Query() queryParams: QueryParamsDto,
  //     @CurrentUser() userId: string,
  //   ): Promise<PageDto<PostViewModel>> {
  //     return this.postsQueryRepository.findByBlogId(queryParams, blogId, userId);
  //   }
}
