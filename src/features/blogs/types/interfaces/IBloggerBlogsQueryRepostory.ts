import { QueryParamsDto } from '../../../../common/pipes/query-params.dto';
import { PageDto } from '../../../../common/utils/PageDto';
import { BlogViewModel } from '../../dto/response/blog-view.model';

export abstract class IBloggerBlogsQueryRepository {
  abstract findAllForBlogger(
    queryParams: QueryParamsDto,
    userId: string,
  ): Promise<PageDto<BlogViewModel>>;

  abstract findById(blogId: string): Promise<BlogViewModel | null>;
}
