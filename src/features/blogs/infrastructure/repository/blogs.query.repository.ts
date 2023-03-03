import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../../domain/blog.entity';
import { Repository } from 'typeorm';
import { QueryParamsDto } from '../../../../common/pipes/query-params.dto';
import { PageDto } from '../../../../common/utils/PageDto';
import { SortFieldsBlogModel } from '../../types/blogs.types';
import { BlogViewModel } from '../../dto/response/blog-view.model';
import { SaBlogViewModel } from '../../dto/response/sa-blog-view.model';
import { ISaBlogsQueryRepository } from '../../types/interfaces/IAdminBlogsQueryRepository';
import { IBloggerBlogsQueryRepository } from '../../types/interfaces/IBloggerBlogsQueryRepostory';
@Injectable()
export class BlogsQueryRepository
  implements ISaBlogsQueryRepository, IBloggerBlogsQueryRepository
{
  constructor(@InjectRepository(Blog) private blogEntity: Repository<Blog>) {
    console.log('BlogsQueryRepository init');
  }

  async findById(blogId: string): Promise<BlogViewModel | null> {
    const blog = await this.blogEntity
      .createQueryBuilder('b')
      .select('b')
      .where('b.id = :blogId', { blogId })
      .getOne();

    return blog ? new BlogViewModel(blog) : null;
  }

  async findAll(queryParams: QueryParamsDto): Promise<PageDto<BlogViewModel>> {
    const [blogs, totalCount] = await this.blogEntity
      .createQueryBuilder('b')
      .select('b')
      .where('b.name ~~* :term', { term: `%${queryParams.searchNameTerm}%` })
      .orderBy(`b.${queryParams.sortByField(SortFieldsBlogModel)}`, queryParams.order)
      .limit(queryParams.pageSize)
      .offset(queryParams.skip)
      .getManyAndCount();

    const blogResponseDto = blogs.map((item) => new BlogViewModel(item));
    return new PageDto(blogResponseDto, queryParams, totalCount);
  }

  async findAllForBlogger(
    queryParams: QueryParamsDto,
    userId: string,
  ): Promise<PageDto<BlogViewModel>> {
    const [blogs, totalCount] = await this.blogEntity
      .createQueryBuilder('b')
      .select('b')
      .where('b.name ~~* :term', { term: `%${queryParams.searchNameTerm}%` })
      .andWhere('b.userId = :userId', { userId })
      .orderBy(`b.${queryParams.sortByField(SortFieldsBlogModel)}`, queryParams.order)
      .limit(queryParams.pageSize)
      .offset(queryParams.skip)
      .getManyAndCount();

    const blogResponseDto = blogs.map((item) => new BlogViewModel(item));
    return new PageDto(blogResponseDto, queryParams, totalCount);
  }

  async findAllForAdmin(queryParams: QueryParamsDto): Promise<PageDto<SaBlogViewModel>> {
    const [blogs, totalCount] = await this.blogEntity
      .createQueryBuilder('b')
      .select(['b', 'blogOwnerInfo.login', 'blogOwnerInfo.id'])
      .where('b.name ~~* :term', { term: `%${queryParams.searchNameTerm}%` })
      .leftJoin('b.user', 'blogOwnerInfo')
      .orderBy(`b.${queryParams.sortByField(SortFieldsBlogModel)}`, queryParams.order)
      .limit(queryParams.pageSize)
      .offset(queryParams.skip)
      .getManyAndCount();

    const blogResponseDto = blogs.map((item) => new SaBlogViewModel(item));
    return new PageDto(blogResponseDto, queryParams, totalCount);
  }
}
