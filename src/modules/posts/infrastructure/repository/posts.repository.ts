import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../domain/post.entity';
import { Repository } from 'typeorm';
import { DbPostDto } from '../../typing/posts.type';

@Injectable()
export class PostsRepository {
  constructor(@InjectRepository(Post) private postEntity: Repository<Post>) {}

  async create(newPost: DbPostDto) {
    const post = new Post();
    post.content = newPost.content;
    post.title = newPost.title;
    post.shortDescription = newPost.shortDescription;
    post.blogId = newPost.blogId;
    await this.postEntity.save(post);
    return post;
  }

  async findById(postId: string) {
    const post = await this.postEntity
      .createQueryBuilder('p')
      .select('p')
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
