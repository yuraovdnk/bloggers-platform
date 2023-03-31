import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../../domain/entity/blog.entity';
import { Repository } from 'typeorm';
import { BlogInputDbType } from '../../application/types/blogs.types';
import { BlogBlackList } from '../../domain/entity/blogBlackList.entity';
import { BanUserForBlogDto } from '../../../users/application/dto/request/banUserForBlog.dto';
import { BlogBanList } from '../../domain/entity/blogBanList';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectRepository(Blog) private blogEntity: Repository<Blog>,
    @InjectRepository(BlogBlackList) private blogBlackListEntity: Repository<BlogBlackList>,
    @InjectRepository(BlogBanList) private blogBanListEntity: Repository<BlogBanList>,
  ) {}

  async findById(blogId: string): Promise<Blog> {
    const blog = await this.blogEntity
      .createQueryBuilder('b')
      .select('b')
      .leftJoinAndSelect('b.banInfo', 'banInfo')
      .where('b.id = :blogId', { blogId })
      .getOne();
    return blog;
  }

  async create(newBlog: BlogInputDbType): Promise<Blog> {
    const blog = Blog.create(newBlog);
    await this.blogEntity.save(blog);
    return blog;
  }

  async save(entity: Blog) {
    await this.blogEntity.save(entity);
  }

  async remove(entity: Blog) {
    await this.blogEntity.remove(entity);
  }

  async banUserForBlog(userId: string, banUserForBlogDto: BanUserForBlogDto) {
    const bannedUser = BlogBlackList.create(userId, banUserForBlogDto);
    await this.blogBlackListEntity.save(bannedUser);
  }
  async unbanUserForBlog(userId: string, blogId: string) {
    return this.blogBlackListEntity.delete({ blogId, userId });
  }

  async unBanBlog(blogId: string) {
    await this.blogBanListEntity.delete({ blogId });
  }
}
