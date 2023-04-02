import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BlogsQueryRepository } from '../infrastructure/repository/blogs.query.repository';
import { BlogsRepository } from '../infrastructure/repository/blogs.repository';
import { PageDto } from '../../../common/utils/PageDto';
import { BannedUsersForBlogViewModel } from '../../users/application/dto/response/bannedUsersForBlog-view.model';
import { BloggerQueryParamsDto } from '../../../common/dtos/blogger-query-params.dto';

@Injectable()
export class BlogsService {
  constructor(
    @Inject(BlogsQueryRepository.name) private blogQueryRepo: BlogsQueryRepository,
    private blogRepo: BlogsRepository,
  ) {}
  async getBannedUsers(
    userId: string,
    blogId: string,
    queryParams: BloggerQueryParamsDto,
  ): Promise<PageDto<BannedUsersForBlogViewModel>> {
    const blog = await this.blogRepo.findById(blogId);
    if (!blog) throw new NotFoundException();

    if (blog.userId !== userId) throw new ForbiddenException();

    return this.blogQueryRepo.getBannedUsersForBlog(blogId, queryParams);
  }
}
