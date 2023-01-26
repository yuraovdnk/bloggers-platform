import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../../domain/blog.entity';
import { Repository } from 'typeorm';
import { QueryParamsDto } from '../../../../common/pipes/query-params.dto';
import { PageDto } from '../../../../common/utils/PageDto';
import { SortFieldsBlogModel } from '../../typing/blogs.types';
import { BlogViewModel } from '../../dto/blog-view.model';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectRepository(Blog) private blogEntity: Repository<Blog>) {}

  async findById(blogId: string): Promise<BlogViewModel | null> {
    const blog = await this.blogEntity
      .createQueryBuilder('b')
      .select('b')
      .where('b.id = :blogId', { blogId })
      .getOne();

    return blog ? new BlogViewModel(blog) : null;
  }

  async findAll(queryParams: QueryParamsDto): Promise<PageDto<BlogViewModel>> {
    const queryBuilder = await this.blogEntity.createQueryBuilder('b');
    queryBuilder
      .select('b')
      .where('b.name like :term', { term: `%${queryParams.searchNameTerm}%` })
      .orderBy(`b.${queryParams.sortByField(SortFieldsBlogModel)}`, queryParams.order)
      .limit(queryParams.pageSize)
      .offset(queryParams.skip);

    const totalCount = await queryBuilder.getCount();
    const blogs = await queryBuilder.getMany();

    const blogResponseDto = blogs.map((item) => new BlogViewModel(item));
    return new PageDto(blogResponseDto, queryParams, totalCount);
  }
}
