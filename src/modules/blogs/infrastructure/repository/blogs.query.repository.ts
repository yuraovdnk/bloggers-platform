import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../../domain/entity/blog.entity';
import { Repository } from 'typeorm';
import { QueryParamsDto } from '../../../../common/dtos/query-params.dto';
import { PageDto } from '../../../../common/utils/PageDto';
import { SortFieldsBlogModel } from '../../application/types/blogs.types';
import { BlogViewModel } from '../../application/dto/response/blog-view.model';
import { SaBlogViewModel } from '../../application/dto/response/sa-blog-view.model';
import { ISaBlogsQueryRepository } from '../../application/interfaces/IAdminBlogsQueryRepository';
import { IBloggerBlogsQueryRepository } from '../../application/interfaces/IBloggerBlogsQueryRepostory';
import { BlogBlackList } from '../../domain/entity/blogBlackList.entity';
import { BannedUsersForBlogViewModel } from '../../../users/application/dto/response/bannedUsersForBlog-view.model';
import { BloggerQueryParamsDto } from '../../../../common/dtos/blogger-query-params.dto';

@Injectable()
export class BlogsQueryRepository
  implements ISaBlogsQueryRepository, IBloggerBlogsQueryRepository
{
  constructor(
    @InjectRepository(Blog) private blogEntity: Repository<Blog>,
    @InjectRepository(BlogBlackList) private blogBanListEntity: Repository<BlogBlackList>,
  ) {}

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
      .where('b.name ~~* :term and "banInfo" is null', {
        term: `%${queryParams.searchNameTerm}%`,
      })
      .leftJoin('b.banInfo', 'banInfo')
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
      .leftJoinAndSelect('b.banInfo', 'banInfo')
      .orderBy(`b.${queryParams.sortByField(SortFieldsBlogModel)}`, queryParams.order)
      .limit(queryParams.pageSize)
      .offset(queryParams.skip)
      .getManyAndCount();
    if (!blogs.length) throw new NotFoundException();
    const blogResponseDto = blogs.map((item) => new SaBlogViewModel(item));
    return new PageDto(blogResponseDto, queryParams, totalCount);
  }

  async getBannedUsersForBlog(
    blogId: string,
    queryParams: BloggerQueryParamsDto,
  ): Promise<PageDto<BannedUsersForBlogViewModel>> {
    const [users, totalCount] = await this.blogBanListEntity
      .createQueryBuilder('banList')
      .addSelect(['bannedUser.login'])
      .leftJoin('banList.user', 'bannedUser')
      .where('banList.blogId = :blogId and bannedUser.login ~~* :login', {
        blogId,
        login: `%${queryParams.searchLoginTerm}%`,
      })
      .getManyAndCount();
    const mapperUsers = users.map((user) => new BannedUsersForBlogViewModel(user));
    return new PageDto(mapperUsers, queryParams, totalCount);
  }
}
