import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueryParamsDto } from '../../../../../common/dtos/query-params.dto';
import { BasicAuthGuard } from '../../../../auth/application/strategies/basic.strategy';
import { BlogsQueryRepository } from '../../../infrastructure/repository/blogs.query.repository';
import { ISaBlogsQueryRepository } from '../../interfaces/IAdminBlogsQueryRepository';
import { PageDto } from '../../../../../common/utils/PageDto';
import { SaBlogViewModel } from '../../dto/response/sa-blog-view.model';
import { CommandBus } from '@nestjs/cqrs';
import { BindBlogWithUserCommand } from '../../use-cases/commands/bindBlogWithUser.use-case';
import { BanBlogCommand } from '../../use-cases/commands/banBlog.use-case';

//SA BlogsController
@UseGuards(BasicAuthGuard)
@Controller('sa/blogs')
export class SaBlogsController {
  constructor(
    @Inject(BlogsQueryRepository.name) private blogsQueryRepository: ISaBlogsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get()
  async getAllBlogs(
    @Query() queryParams: QueryParamsDto,
  ): Promise<PageDto<SaBlogViewModel>> {
    return this.blogsQueryRepository.findAllForAdmin(queryParams);
  }

  @Put(':blogId/bind-with-user/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async bindBlog(
    @Param('blogId', ParseUUIDPipe) blogId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.commandBus.execute(new BindBlogWithUserCommand(userId, blogId));
  }

  @Put(':blogId/ban')
  @HttpCode(HttpStatus.NO_CONTENT)
  async banBlog(
    @Param('blogId', ParseUUIDPipe) blogId: string,
    @Body('isBanned', ParseBoolPipe) banStatus: boolean,
  ) {
    return this.commandBus.execute(new BanBlogCommand(blogId, banStatus));
  }
}
