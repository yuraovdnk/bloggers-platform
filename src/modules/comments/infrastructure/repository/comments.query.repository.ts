import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../../domain/comment.entity';
import { Repository } from 'typeorm';
import { Like } from '../../../likes/domain/like.entity';
import { CommentViewModel } from '../../dto/comment-view.model';
import { QueryParamsDto } from '../../../../common/pipes/query-params.dto';
import { PageDto } from '../../../../common/utils/PageDto';
import { SortCommentFields } from '../../typing/comments.type';

@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectRepository(Comment) private commentEntity: Repository<Comment>) {}

  async findById(commentId: string, userId: string): Promise<CommentViewModel | null> {
    const comment: Comment = await this.commentEntity
      .createQueryBuilder('comment')
      .select(['comment', 'likes'])
      .leftJoin('comment.user', 'user')
      .addSelect('user.login')
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select([
              'l."parentId"',
              `COUNT(*) FILTER( where l."likeStatus" = 'Like')::int AS "likesCount" ,
               COUNT(*) FILTER( where l."likeStatus" = 'Dislike')::int AS "dislikesCount"`,
            ])
            .from(Like, 'l')
            .groupBy('l."parentId"');
        },
        'likes',
        '"likes"."parentId" = comment.id',
      )
      .addSelect((subQuery) => {
        return subQuery
          .select('li."likeStatus" as "myStatus"')
          .from(Like, 'li')
          .where('li.parentId = comment.id')
          .andWhere('li.userId = :userId', { userId });
      })
      .where('comment.id = :commentId', { commentId })
      .getRawOne();

    if (!comment) return null;
    return new CommentViewModel(comment);
  }

  async findAllByPostId(
    postId: string,
    queryParams: QueryParamsDto,
    userId: string = null,
  ): Promise<PageDto<CommentViewModel>> {
    const comments: Comment[] = await this.commentEntity
      .createQueryBuilder('comment')
      .select(['comment', 'likes'])
      .leftJoin('comment.user', 'user')
      .addSelect('user.login')
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select([
              'l."parentId"',
              `coalesce( COUNT(*) FILTER( where l."likeStatus" = 'Like'),0)::int AS "likesCount" ,
               COUNT(*) FILTER( where l."likeStatus" = 'Dislike' IS NULL)::int AS "dislikesCount"`,
            ])
            .from(Like, 'l')
            .groupBy('l."parentId"');
        },
        'likes',
        '"likes"."parentId" = comment.id',
      )
      .addSelect((subQuery) => {
        return subQuery
          .select('li."likeStatus" as "myStatus"')
          .from(Like, 'li')
          .where('li.parentId = comment.id')
          .andWhere('li.userId = :userId', { userId });
      })
      .where('comment.postId = :postId', { postId })
      .orderBy(`comment.${queryParams.sortByField(SortCommentFields)}`)
      .getRawMany();

    const mappedComments: CommentViewModel[] = comments.map((i) => new CommentViewModel(i));
    return new PageDto<CommentViewModel>(mappedComments, queryParams);
  }
}
