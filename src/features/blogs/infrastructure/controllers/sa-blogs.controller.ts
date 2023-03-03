import {
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueryParamsDto } from '../../../../common/pipes/query-params.dto';
import { BasicAuthGuard } from '../../../auth/strategies/basic.strategy';
import { BlogsQueryRepository } from '../repository/blogs.query.repository';
import { ISaBlogsQueryRepository } from '../../types/interfaces/IAdminBlogsQueryRepository';
import { PageDto } from '../../../../common/utils/PageDto';
import { SaBlogViewModel } from '../../dto/response/sa-blog-view.model';
import { CommandBus } from '@nestjs/cqrs';
import { BindBlogWithUserCommand } from '../../../users/application/use-cases/bindBlogWithUser.use-case';

//SA BlogsController
@UseGuards(BasicAuthGuard)
@Controller('sa/blogs')
export class SaBlogsController {
  constructor(
    @Inject(BlogsQueryRepository.name) private blogsQueryRepository: ISaBlogsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get('')
  async getAllBlogs(
    @Query() queryParams: QueryParamsDto,
  ): Promise<PageDto<SaBlogViewModel>> {
    return this.blogsQueryRepository.findAllForAdmin(queryParams);
  }
  @Put(':blogId/bind-with-user/:userId')
  @HttpCode(204)
  async bindBlog(
    @Param('blogId', ParseUUIDPipe) blogId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.commandBus.execute(new BindBlogWithUserCommand(userId, blogId));
  }
}
