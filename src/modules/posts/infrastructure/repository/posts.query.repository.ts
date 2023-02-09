import { QueryParamsDto } from '../../../../common/pipes/query-params.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../domain/post.entity';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Like } from '../../../likes/domain/like.entity';
import { PageDto } from '../../../../common/utils/PageDto';
import { PostRawQuery, SortFieldsPostModel } from '../../typing/posts.type';
import { PostViewModel } from '../../dto/post-view.model';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectRepository(Post) private postEntity: Repository<Post>) {
    console.log('PostsQueryRepository init');
  }

  async getAll(queryParams: QueryParamsDto, userId = null): Promise<PageDto<PostViewModel>> {
    const queryBuilder = this.postEntity.createQueryBuilder('post');
    queryBuilder
      .select(['post', 'blog.name as "post_blogName"'])
      .leftJoin('post.blog', 'blog')
      .leftJoin(
        Like,
        'likesCount',
        '"likesCount"."parentId" = post.id and "likesCount"."parentType" = \'post\'',
      )
      .addSelect([
        'COALESCE(COUNT(*) FILTER( where "likesCount"."likeStatus" = \'Dislike\'),0)::int AS "post_dislikesCount"',
        'COALESCE(COUNT(*) FILTER( where "likesCount"."likeStatus" = \'Like\'),0)::int AS "post_likesCount"',
      ])
      .addSelect((subQuery) => {
        return subQuery
          .select(`COALESCE(l.likeStatus,'None') as "post_myStatus"`)
          .from(Like, 'l')
          .where(`post.id = l.parentId and l.userId = :userId and l.parentType='post'`, {
            userId,
          });
      })
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
              .where(
                `l.parentId = post.id and l.parentType = 'post' and l.likeStatus = 'Like'`,
              )
              .leftJoin('l.user', 'user')
              .orderBy('l.addedAt', 'DESC')
              .limit(3)
              .offset(0);
          }, 'newestLikes');
      })
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
      .leftJoin(
        Like,
        'likesCount',
        '"likesCount"."parentId" = post.id and "likesCount"."parentType" = \'post\'',
      )
      .addSelect([
        'COALESCE(COUNT(*) FILTER( where "likesCount"."likeStatus" = \'Dislike\'),0)::int AS "post_dislikesCount"',
        'COALESCE(COUNT(*) FILTER( where "likesCount"."likeStatus" = \'Like\'),0)::int AS "post_likesCount"',
      ])
      .addSelect((subQuery) => {
        return subQuery
          .select(`COALESCE(l.likeStatus,'None') as "post_myStatus"`)
          .from(Like, 'l')
          .where(`post.id = l.parentId and l.userId = :userId and l.parentType='post'`, {
            userId,
          });
      })
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
              .where(
                `l.parentId = post.id and l.parentType = 'post' and l.likeStatus = 'Like'`,
              )
              .leftJoin('l.user', 'user')
              .orderBy('l.addedAt', 'DESC')
              .limit(3)
              .offset(0);
          }, 'newestLikes');
      })
      .where('post.id = :postId', { postId })
      .groupBy('post.id,"post_blogName"')
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
      .leftJoin(
        Like,
        'likesCount',
        '"likesCount"."parentId" = post.id and "likesCount"."parentType" = \'post\'',
      )
      .addSelect([
        'COALESCE(COUNT(*) FILTER( where "likesCount"."likeStatus" = \'Dislike\'),0)::int AS "post_dislikesCount"',
        'COALESCE(COUNT(*) FILTER( where "likesCount"."likeStatus" = \'Like\'),0)::int AS "post_likesCount"',
      ])
      .addSelect((subQuery) => {
        return subQuery
          .select(`COALESCE(l.likeStatus,'None') as "post_myStatus"`)
          .from(Like, 'l')
          .where(`post.id = l.parentId and l.userId = :userId and l.parentType='post'`, {
            userId,
          });
      })
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
              .where(
                `l.parentId = post.id and l.parentType = 'post' and l.likeStatus = 'Like'`,
              )
              .leftJoin('l.user', 'user')
              .orderBy('l.addedAt', 'DESC')
              .limit(3)
              .offset(0);
          }, 'newestLikes');
      })
      .where('post.blogId = :blogId', { blogId })
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
