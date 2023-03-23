import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../domain/entity/post.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { DbPostDto } from '../../application/types/posts.type';
import { log } from 'util';

@Injectable()
export class PostsRepository {
  constructor(@InjectRepository(Post) private postEntity: Repository<Post>) {
    console.log('PostsRepository');
  }

  async create(newPost: DbPostDto) {
    const post = new Post();
    post.content = newPost.content;
    post.title = newPost.title;
    post.shortDescription = newPost.shortDescription;
    post.blogId = newPost.blogId;
    await this.postEntity.save(post);
    return post;
  }

  async findById(postId: string, userId = null) {
    const post = await this.postEntity
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.blog', 'blog')
      .leftJoinAndSelect(
        'blog.usersBanList',
        'usersBanList',
        'usersBanList.userId = :userId',
        { userId },
      )
      .where('p.id = :postId', { postId })
      .getOne();
    return post;
  }

  async save(entity: Post) {
    await this.postEntity.save(entity);
  }

  async remove(entity: Post) {
    await this.postEntity.remove(entity);
  }
}
