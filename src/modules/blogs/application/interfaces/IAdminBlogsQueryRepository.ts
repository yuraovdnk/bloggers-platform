import { QueryParamsDto } from '../../../../common/dtos/query-params.dto';
import { PageDto } from '../../../../common/utils/PageDto';
import { SaBlogViewModel } from '../dto/response/sa-blog-view.model';

export abstract class ISaBlogsQueryRepository {
  abstract findAllForAdmin(queryParams: QueryParamsDto): Promise<PageDto<SaBlogViewModel>>;
}
