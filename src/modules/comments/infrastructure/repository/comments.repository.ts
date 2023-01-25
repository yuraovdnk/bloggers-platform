import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../../domain/comment.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CommentInputType } from '../../typing/comments.type';

@Injectable()
export class CommentsRepository {
  constructor(@InjectRepository(Comment) private commentEntity: Repository<Comment>) {}

  async create(newComment: CommentInputType) {
    const comment = new Comment();
    comment.postId = newComment.postId;
    comment.content = newComment.content;
    comment.userId = newComment.userId;
    await this.commentEntity.save(comment);
    return comment.id;
  }

  async findByPostId(postId: string) {
    const post = await this.commentEntity
      .createQueryBuilder('c')
      .select('c')
      .where('c.postId = :postId', { postId });
  }

  async findById(commentId: string) {
    const comment = await this.commentEntity
      .createQueryBuilder('c')
      .select('c')
      .where('c.id = :commentId', { commentId })
      .getOne();
    return comment;
  }

  async save(entity: Comment) {
    await this.commentEntity.save(entity);
  }

  async remove(entity: Comment) {
    await this.commentEntity.remove(entity);
  }
}
