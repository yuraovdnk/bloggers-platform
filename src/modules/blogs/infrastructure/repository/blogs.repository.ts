import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../../domain/entity/blog.entity';
import { Repository } from 'typeorm';
import { BlogInputDbType } from '../../application/types/blogs.types';
import { BlogBanList } from '../../domain/entity/blogBanList.entity';
import { BanUserForBlogDto } from '../../../users/application/dto/request/banUserForBlog.dto';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectRepository(Blog) private blogEntity: Repository<Blog>,
    @InjectRepository(BlogBanList) private blogBanListEntity: Repository<BlogBanList>,
  ) {
    console.log('BlogsRepository init');
  }

  async findById(blogId: string): Promise<Blog> {
    const blog = await this.blogEntity
      .createQueryBuilder('b')
      .select('b')
      .where('b.id = :blogId', { blogId })
      .getOne();
    return blog;
  }

  async create(newBlog: BlogInputDbType): Promise<Blog> {
    const blog = new Blog();
    blog.name = newBlog.name;
    blog.description = newBlog.description;
    blog.websiteUrl = newBlog.websiteUrl;
    blog.userId = newBlog.userId;
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
    const bannedUser = new BlogBanList();
    bannedUser.blogId = banUserForBlogDto.blogId;
    bannedUser.isBanned = banUserForBlogDto.isBanned;
    bannedUser.banReason = banUserForBlogDto.banReason;
    bannedUser.userId = userId;
    await this.blogBanListEntity.save(bannedUser);
  }
  async unbanUserForBlog(userId: string, blogId: string) {
    return this.blogBanListEntity.delete({ blogId, userId });
  }
}
