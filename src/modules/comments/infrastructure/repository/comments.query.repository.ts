import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../../domain/comment.entity';
import { Repository } from 'typeorm';
import { Like } from '../../../likes/domain/like.entity';
import { CommentViewModel } from '../../dto/comment-view.model';
import { QueryParamsDto } from '../../../../common/pipes/query-params.dto';
import { PageDto } from '../../../../common/utils/PageDto';
import { RawQueryComment, SortCommentFields } from '../../typing/comments.type';

@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectRepository(Comment) private commentEntity: Repository<Comment>) {
    console.log('CommentsQueryRepository init');
  }

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

    return comment ? new CommentViewModel(comment) : null;
  }

  async findAllByPostId(
    postId: string,
    queryParams: QueryParamsDto,
    userId: string = null,
  ): Promise<PageDto<CommentViewModel> | null> {
    const queryBuilder = await this.commentEntity.createQueryBuilder('comment');

    queryBuilder
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
      .where('comment.postId = :postId', { postId })
      .orderBy(`comment.${queryParams.sortByField(SortCommentFields)}`, queryParams.order);

    const totalCount = await queryBuilder.getCount();
    const comments: RawQueryComment[] = await queryBuilder.getRawMany();
    if (!comments.length) {
      return null;
    }
    const mappedComments: CommentViewModel[] = comments.map((i) => new CommentViewModel(i));
    return new PageDto<CommentViewModel>(mappedComments, queryParams, totalCount);
  }
}
