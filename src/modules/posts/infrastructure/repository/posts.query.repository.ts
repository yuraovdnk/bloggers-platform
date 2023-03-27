import { QueryParamsDto } from '../../../../common/dtos/query-params.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../domain/entity/post.entity';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Like } from '../../../likes/domain/like.entity';
import { PageDto } from '../../../../common/utils/PageDto';
import { PostRawQuery, SortFieldsPostModel } from '../../application/types/posts.type';
import { PostViewModel } from '../../application/dto/post-view.model';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectRepository(Post) private postEntity: Repository<Post>) {}

  async getAll(queryParams: QueryParamsDto, userId = null) {
    const queryBuilder = this.postEntity.createQueryBuilder('post');
    queryBuilder
      .select(['post', 'blog.name as "post_blogName"'])
      .leftJoin('post.blog', 'blog')
      .addSelect((subQuery) => {
        return subQuery
          .select(`COALESCE(l.likeStatus,'None') as "post_myStatus"`)
          .from(Like, 'l')
          .where(`post.id = l.parentId and l.userId = :userId and l.parentType='post'`, {
            userId,
          });
      })
      .addSelect([
        'COALESCE(COUNT(*) FILTER( where "likesForCount"."like_likeStatus" = \'Dislike\'),0)::int AS "post_dislikesCount"',
        'COALESCE(COUNT(*) FILTER( where "likesForCount"."like_likeStatus" = \'Like\'),0)::int AS "post_likesCount"',
      ]) //count Likes
      .leftJoin(
        (sub) =>
          sub
            .select(['like'])
            .from(Like, 'like')
            .leftJoin('like.user', 'user')
            .leftJoin('user.banInfo', 'user_banInfo')
            .where('"user_banInfo" is null'),
        'likesForCount',
        '"likesForCount"."like_parentId" = post.id and "likesForCount"."like_parentType" = \'post\'',
      )
      .addSelect((db) => {
        return db
          .select([`COALESCE(json_agg("newestLikes"),'[]') as "post_newestLikes"`])
          .from((sub) => {
            return sub
              .select([
                'l.userId as "userId"',
                'l.addedAt as "addedAt"',
                'user.login as "login"',
              ])
              .from(Like, 'l')
              .leftJoin('l.user', 'user')
              .leftJoin('user.banInfo', 'user_banInfo')
              .where(
                `l.parentId = post.id and l.parentType = 'post' and l.likeStatus = 'Like' and user_banInfo.isBanned is null`,
              )
              .orderBy('l.addedAt', 'DESC')
              .limit(3)
              .offset(0);
          }, 'newestLikes');
      })
      .where('blog.isBanned = false')
      .groupBy('post.id,"post_blogName"')
      .orderBy(`"post_${queryParams.sortByField(SortFieldsPostModel)}"`, queryParams.order)
      .limit(queryParams.pageSize)
      .offset(queryParams.skip);

    const posts = await queryBuilder.getRawMany();
    if (!posts.length) throw new NotFoundException();
    const totalCount = await queryBuilder.getCount();
    const postsResponseDto = posts.map((i) => new PostViewModel(i));

    return new PageDto(postsResponseDto, queryParams, totalCount);
  }

  async getById(postId: string, userId = null): Promise<PostViewModel> {
    const post: PostRawQuery = await this.postEntity
      .createQueryBuilder('post')
      .select(['post', 'blog.name as "post_blogName"'])
      .leftJoin('post.blog', 'blog')
      .addSelect((subQuery) => {
        return subQuery
          .select(`COALESCE(l.likeStatus,'None') as "post_myStatus"`)
          .from(Like, 'l')
          .where(`post.id = l.parentId and l.userId = :userId and l.parentType='post'`, {
            userId,
          });
      })
      .addSelect([
        'COALESCE(COUNT(*) FILTER( where "likesForCount"."like_likeStatus" = \'Dislike\'),0)::int AS "post_dislikesCount"',
        'COALESCE(COUNT(*) FILTER( where "likesForCount"."like_likeStatus" = \'Like\'),0)::int AS "post_likesCount"',
      ])
      .leftJoin(
        (sub) =>
          sub
            .select(['like'])
            .from(Like, 'like')
            .leftJoin('like.user', 'user')
            .leftJoin('user.banInfo', 'user_banInfo')
            .where('"user_banInfo" is null'),
        'likesForCount',
        '"likesForCount"."like_parentId" = post.id and "likesForCount"."like_parentType" = \'post\'',
      )
      .addSelect((db) => {
        return db
          .select([`COALESCE(json_agg("newestLikes"),'[]') as "post_newestLikes"`])
          .from((sub) => {
            return sub
              .select([
                'l.userId as "userId"',
                'l.addedAt as "addedAt"',
                'user.login as "login"',
              ])
              .from(Like, 'l')
              .leftJoin('l.user', 'user')
              .leftJoin('user.banInfo', 'user_banInfo')
              .where(
                `l.parentId = post.id and l.parentType = 'post' and l.likeStatus = 'Like' and user_banInfo.isBanned is null`,
              )
              .orderBy('l.addedAt', 'DESC')
              .limit(3)
              .offset(0);
          }, 'newestLikes');
      })
      .groupBy('post.id,"post_blogName"')
      .where('post.id = :postId and blog.isBanned = false', { postId })
      .getRawOne();

    return post ? new PostViewModel(post) : null;
  }

  async getAllByBlogId(
    queryParams: QueryParamsDto,
    blogId: string,
    userId: string = null,
  ): Promise<PageDto<PostViewModel>> {
    const queryBuilder = this.postEntity.createQueryBuilder('post');
    queryBuilder
      .select(['post', 'blog.name as "post_blogName"'])
      .leftJoin('post.blog', 'blog')
      .addSelect((subQuery) => {
        return subQuery
          .select(`COALESCE(l.likeStatus,'None') as "post_myStatus"`)
          .from(Like, 'l')
          .where(`post.id = l.parentId and l.userId = :userId and l.parentType='post'`, {
            userId,
          });
      }) //myStatus
      .addSelect([
        'COALESCE(COUNT(*) FILTER( where "likesForCount"."like_likeStatus" = \'Dislike\'),0)::int AS "post_dislikesCount"',
        'COALESCE(COUNT(*) FILTER( where "likesForCount"."like_likeStatus" = \'Like\'),0)::int AS "post_likesCount"',
      ]) //count Likes
      .leftJoin(
        (sub) =>
          sub
            .select(['like'])
            .from(Like, 'like')
            .leftJoin('like.user', 'user')
            .leftJoin('user.banInfo', 'user_banInfo')
            .where('"user_banInfo" is null'),
        'likesForCount',
        '"likesForCount"."like_parentId" = post.id and "likesForCount"."like_parentType" = \'post\'',
      )
      .addSelect((db) => {
        return db
          .select([`COALESCE(json_agg("newestLikes"),'[]') as "post_newestLikes"`])
          .from((sub) => {
            return sub
              .select([
                'l.userId as "userId"',
                'l.addedAt as "addedAt"',
                'user.login as "login"',
              ])
              .from(Like, 'l')
              .leftJoin('l.user', 'user')
              .leftJoin('user.banInfo', 'user_banInfo')
              .where(
                `l.parentId = post.id and l.parentType = 'post' and l.likeStatus = 'Like' and user_banInfo.isBanned is null`,
              )
              .orderBy('l.addedAt', 'DESC')
              .limit(3)
              .offset(0);
          }, 'newestLikes');
      })
      .where('post.blogId = :blogId and blog.isBanned = false', { blogId })
      .groupBy('post.id,"post_blogName"')
      .orderBy(`"post_${queryParams.sortByField(SortFieldsPostModel)}"`, queryParams.order)
      .limit(queryParams.pageSize)
      .offset(queryParams.skip);

    const totalCount = await queryBuilder.getCount();
    const posts: PostRawQuery[] = await queryBuilder.getRawMany();

    const postResponseDto = posts.map((i) => new PostViewModel(i));
    return new PageDto(postResponseDto, queryParams, totalCount);
  }
}
