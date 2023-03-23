import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../../../../../common/guards/jwt.strategy';
import { BanUserForBlogDto } from '../../dto/request/banUserForBlog.dto';
import { CommandBus } from '@nestjs/cqrs';
import { BanUserForBlogCommand } from '../../use-cases/banUserForBlog.use-case';
import { BlogsQueryRepository } from '../../../../blogs/infrastructure/repository/blogs.query.repository';
import { IBloggerBlogsQueryRepository } from '../../../../blogs/application/interfaces/IBloggerBlogsQueryRepostory';
import { BloggerQueryParamsDto } from '../../../../../common/dtos/blogger-query-params.dto';
import { PageDto } from '../../../../../common/utils/PageDto';
import { BannedUsersForBlogViewModel } from '../../dto/response/bannedUsersForBlog-view.model';

@UseGuards(JwtGuard)
@Controller('blogger/users')
export class BloggerUsersController {
  constructor(
    private commandBus: CommandBus,
    @Inject(BlogsQueryRepository.name)
    private blogsQueryRepository: IBloggerBlogsQueryRepository,
  ) {}

  @Put(':userId/ban')
  @HttpCode(HttpStatus.NO_CONTENT)
  async banUserForBlog(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() banUserDto: BanUserForBlogDto,
  ): Promise<void> {
    await this.commandBus.execute(new BanUserForBlogCommand(userId, banUserDto));
  }

  @Get('blog/:blogId')
  async getBannedUsers(
    @Param('blogId', ParseUUIDPipe) blogId: string,
    @Query() queryParams: BloggerQueryParamsDto,
  ): Promise<PageDto<BannedUsersForBlogViewModel>> {
    return this.blogsQueryRepository.getBannedUsersForBlog(blogId, queryParams);
  }
}
