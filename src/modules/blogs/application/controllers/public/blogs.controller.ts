import { BlogsQueryRepository } from '../../../infrastructure/repository/blogs.query.repository';
import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueryParamsDto } from '../../../../../common/dtos/query-params.dto';
import { PageDto } from '../../../../../common/utils/PageDto';
import { BlogViewModel } from '../../dto/response/blog-view.model';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator';
import { PostViewModel } from '../../../../posts/application/dto/post-view.model';
import { PostsQueryRepository } from '../../../../posts/infrastructure/repository/posts.query.repository';
import { JwtExtractGuard } from '../../../../../common/guards/jwt-extract.guard';

//public BlogsController
@Controller('blogs')
export class BlogsController {
  constructor(
    @Inject(BlogsQueryRepository.name)
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  //get all blogs
  @Get()
  async getAllBlogs(@Query() queryParams: QueryParamsDto): Promise<PageDto<BlogViewModel>> {
    return this.blogsQueryRepository.findAll(queryParams);
  }

  //get blog by id
  @Get(':blogId')
  async getBlogById(@Param('blogId', ParseUUIDPipe) blogId: string): Promise<BlogViewModel> {
    const blog = await this.blogsQueryRepository.findById(blogId);
    if (!blog) {
      throw new NotFoundException();
    }
    return blog;
  }

  //get all posts by blogId
  @Get(':blogId/posts')
  @UseGuards(JwtExtractGuard)
  async getPostsByBlogId(
    @Param('blogId', ParseUUIDPipe) blogId: string,
    @Query() queryParams: QueryParamsDto,
    @CurrentUser() userId: string,
  ): Promise<PageDto<PostViewModel>> {
    const blog = await this.blogsQueryRepository.findById(blogId);
    if (!blog) throw new NotFoundException();
    return this.postsQueryRepository.getAllByBlogId(queryParams, blogId, userId);
  }
}
