import { QueryParamsDto } from '../../../../common/dtos/query-params.dto';
import { PageDto } from '../../../../common/utils/PageDto';
import { BlogViewModel } from '../dto/response/blog-view.model';
import { BloggerQueryParamsDto } from '../../../../common/dtos/blogger-query-params.dto';
import { BannedUsersForBlogViewModel } from '../../../users/application/dto/response/bannedUsersForBlog-view.model';

export abstract class IBloggerBlogsQueryRepository {
  abstract findAllForBlogger(
    queryParams: QueryParamsDto,
    userId: string,
  ): Promise<PageDto<BlogViewModel>>;

  abstract findById(blogId: string): Promise<BlogViewModel | null>;

  abstract getBannedUsersForBlog(
    blogId: string,
    queryParams: BloggerQueryParamsDto,
  ): Promise<PageDto<BannedUsersForBlogViewModel>>;
}
