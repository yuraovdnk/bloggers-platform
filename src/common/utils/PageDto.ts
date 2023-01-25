import { QueryParamsDto } from '../pipes/query-params.dto';

export class PageDto<T> {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
  constructor(items: any, queryParams: QueryParamsDto) {
    this.pagesCount = Math.ceil(items.length / queryParams.pageSize);
    this.page = queryParams.pageNumber;
    this.totalCount = items.length;
    this.pageSize = queryParams.pageSize;
    this.items = items;
  }
}
