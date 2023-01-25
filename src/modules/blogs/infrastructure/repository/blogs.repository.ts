import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../../domain/blog.entity';
import { Repository } from 'typeorm';
import { BlogInputDbType } from '../../typing/blogs.types';

@Injectable()
export class BlogsRepository {
  constructor(@InjectRepository(Blog) private blogEntity: Repository<Blog>) {}

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
    await this.blogEntity.save(blog);
    return blog;
  }

  async save(entity: Blog) {
    await this.blogEntity.save(entity);
  }

  async remove(entity: Blog) {
    await this.blogEntity.remove(entity);
  }
}
