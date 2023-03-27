import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../../domain/entity/comment.entity';
import { Repository } from 'typeorm';
import { Like } from '../../../likes/domain/like.entity';
import { CommentViewModel } from '../../application/dto/comment-view.model';
import { QueryParamsDto } from '../../../../common/dtos/query-params.dto';
import { PageDto } from '../../../../common/utils/PageDto';
import { RawQueryComment, SortCommentFields } from '../../application/types/comments.type';
import { BloggerCommentViewModel } from '../../../blogs/application/dto/response/blogger-comment-view.model';
import { SortFieldsPostModel } from '../../../posts/application/types/posts.type';

@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectRepository(Comment) private commentEntity: Repository<Comment>) {}

  async findById(commentId: string, userId: string): Promise<CommentViewModel | null> {
    const comment: Comment = await this.commentEntity
      .createQueryBuilder('comment')
      .select(['comment', 'likes'])
      .leftJoin('comment.user', 'user')
      .leftJoin('user.banInfo', 'userBanInfo')
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
            .leftJoin('l.user', 'user')
            .leftJoin('user.banInfo', 'user_banInfo')
            .where('"user_banInfo" is null')
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
      .where('comment.id = :commentId and "userBanInfo"."isBanned" is null', { commentId })
      .getRawOne();

    return comment ? new CommentViewModel(comment) : null;
  }

  async findAllByPostId(
    postId: string,
    queryParams: QueryParamsDto,
    userId: string = null,
  ): Promise<PageDto<CommentViewModel> | null> {
    const queryBuilder = await this.commentEntity.createQueryBuilder('comment');

    queryBuilder //l_likeStatus
      .select([
        'comment',
        'COALESCE("likes"."likesCount",0)::int as "likesCount"',
        'COALESCE("likes"."dislikesCount",0)::int as "dislikesCount"',
        'user.login',
      ])
      .addSelect((subQuery) => {
        return subQuery
          .select('li."likeStatus" as "myStatus"')
          .from(Like, 'li')
          .where('li.parentId = comment.id')
          .andWhere('li.userId = :userId', { userId });
      })
      .leftJoin('comment.user', 'user')
      .leftJoin('user.banInfo', 'user_banInfo')
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select([
              'l',
              `COUNT(*) FILTER( where l."likeStatus" = 'Like')::int AS "likesCount"`,
              `COUNT(*) FILTER( where l."likeStatus" = 'Dislike')::int AS "dislikesCount"`,
            ])
            .from(Like, 'l')
            .leftJoin('l.user', 'user')
            .leftJoin('user.banInfo', 'user_banInfo')
            .where('"user_banInfo" is null')
            .groupBy('l."id"');
        },
        'likes',
        `"likes"."l_parentId" = comment.id and "likes"."l_parentType" = 'comment' `,
      )
      .where('comment.postId = :postId and "user_banInfo" is null ', { postId })
      .orderBy(`comment.${queryParams.sortByField(SortCommentFields)}`, queryParams.order);
    const totalCount = await queryBuilder.getCount();
    const comments: RawQueryComment[] = await queryBuilder.getRawMany();
    if (!comments.length) {
      return null;
    }
    const mappedComments: CommentViewModel[] = comments.map((i) => new CommentViewModel(i));
    return new PageDto<CommentViewModel>(mappedComments, queryParams, totalCount);
  }

  async findAllCommentsForBlogs(
    queryParams: QueryParamsDto,
    userId: string,
  ): Promise<PageDto<BloggerCommentViewModel>> {
    const [comments, totalCount] = await this.commentEntity
      .createQueryBuilder('c')
      .select('c')
      .where('blog.userId = :userId', { userId })
      .leftJoinAndSelect('c.post', 'post')
      .leftJoinAndSelect('post.blog', 'blog')
      .leftJoinAndSelect('c.user', 'user')
      .orderBy(`c.${queryParams.sortByField(SortCommentFields)}`, queryParams.order)
      .limit(queryParams.pageSize)
      .offset(queryParams.skip)
      .getManyAndCount();
    const mappedComments = comments.map((i) => new BloggerCommentViewModel(i));
    return new PageDto(mappedComments, queryParams, totalCount);
  }
}
