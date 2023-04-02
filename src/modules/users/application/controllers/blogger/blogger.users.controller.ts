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
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator';
import { BlogsService } from '../../../../blogs/application/blogs.service';

@UseGuards(JwtGuard)
@Controller('blogger/users')
export class BloggerUsersController {
  constructor(
    private commandBus: CommandBus,
    @Inject(BlogsQueryRepository.name)
    private blogsQueryRepository: IBloggerBlogsQueryRepository,
    private blogsService: BlogsService,
  ) {}

  @Put(':userId/ban')
  @HttpCode(HttpStatus.NO_CONTENT)
  async banUserForBlog(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() banUserDto: BanUserForBlogDto,
    @CurrentUser() currentUserId: string,
  ): Promise<void> {
    await this.commandBus.execute(
      new BanUserForBlogCommand(userId, banUserDto, currentUserId),
    );
  }

  @Get('blog/:blogId')
  async getBannedUsers(
    @Param('blogId', ParseUUIDPipe) blogId: string,
    @Query() queryParams: BloggerQueryParamsDto,
    @CurrentUser() userId: string,
  ): Promise<PageDto<BannedUsersForBlogViewModel>> {
    return this.blogsService.getBannedUsers(userId, blogId, queryParams);
  }
}
