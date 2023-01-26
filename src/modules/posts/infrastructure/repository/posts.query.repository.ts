import { QueryParamsDto } from '../../../../common/pipes/query-params.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../domain/post.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Like } from '../../../likes/domain/like.entity';
import { PostMapper } from './post.mapper';
import { PageDto } from '../../../../common/utils/PageDto';
import { PostViewModel } from '../../dto/post-view.model';
import { PostRawQuery, SortFieldsPostModel } from '../../typing/posts.type';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectRepository(Post) private postEntity: Repository<Post>) {}

  async findAll(
    queryParams: QueryParamsDto,
    userId: string,
  ): Promise<PageDto<PostViewModel>> {
    const queryBuilder = this.postEntity.createQueryBuilder('post');
    queryBuilder
      .select(['post', 'likesCount', 'likes', 'blog.name as "post_blogName"'])
      .leftJoin('post.blog', 'blog')
      .leftJoin(
        //TODO leftJoin id not null
        (subQuery) => {
          return subQuery
            .select([
              'l."parentId"',
              `COUNT(*) FILTER( where l."likeStatus" = 'Like')::int AS "post_likesCount" ,
               COUNT(*) FILTER( where l."likeStatus" = 'Dislike')::int AS "post_dislikesCount"`,
            ])
            .from(Like, 'l')
            .groupBy('l."parentId"');
        },
        'likesCount',
        '"likesCount"."parentId" = post.id',
      )
      .addSelect((subQuery) => {
        return subQuery
          .select('l.likeStatus as "post_myStatus"')
          .from(Like, 'l')
          .where('post.id = l.parentId and l.userId = :userId', { userId });
      })
      .leftJoin(
        (db) => {
          return db
            .select(['l', 'user.login as "l_userLogin"'])
            .from(Like, 'l')
            .where(`l.parentType = 'post' and l.likeStatus = 'Like'`)
            .leftJoin('l.user', 'user')
            .orderBy('l.addedAt', 'DESC')
            .limit(3)
            .offset(0);
        },
        'likes',
        '"likes"."l_parentId" = post.id',
      )
      .orderBy('likes."l_addedAt"', 'DESC') //for Likes
      .addOrderBy(`post.${queryParams.sortByField(SortFieldsPostModel)}`, queryParams.order)
      .limit(queryParams.pageSize)
      .offset(queryParams.skip);

    const totalCount = await queryBuilder.getCount();

    const posts: PostRawQuery[] = await queryBuilder.getRawMany();

    const postViewDto: PostViewModel[] = PostMapper.mapLikes(posts);
    return new PageDto(postViewDto, queryParams, totalCount);
  }

  async findById(postId: string, userId?: string): Promise<PostViewModel> {
    const post: PostRawQuery[] = await this.postEntity
      .createQueryBuilder('post')
      .select(['post', 'likesCount', 'likes', 'blog.name as "post_blogName"'])
      .where('post.id = :postId', { postId })
      .leftJoin('post.blog', 'blog')
      .leftJoin(
        //TODO leftJoin id not null
        (subQuery) => {
          return subQuery
            .select([
              'l."parentId"',
              `COUNT(*) FILTER( where l."likeStatus" = 'Like')::int AS "post_likesCount" ,
               COUNT(*) FILTER( where l."likeStatus" = 'Dislike')::int AS "post_dislikesCount"`,
            ])
            .from(Like, 'l')
            .groupBy('l."parentId"');
        },
        'likesCount',
        '"likesCount"."parentId" = post.id',
      )
      .addSelect((subQuery) => {
        return subQuery
          .select('l.likeStatus as "post_myStatus"')
          .from(Like, 'l')
          .where('post.id = l.parentId and l.userId = :userId', { userId });
      })
      .leftJoin(
        (db) => {
          return db
            .select(['l', 'user.login as "l_userLogin"'])
            .from(Like, 'l')
            .where(`l.parentType = 'post' and l.likeStatus = 'Like'`)
            .leftJoin('l.user', 'user')
            .orderBy('l.addedAt', 'DESC')
            .limit(3)
            .offset(0);
        },
        'likes',
        '"likes"."l_parentId" = post.id',
      )
      .orderBy('likes."l_addedAt"', 'DESC') //for Likes

      .getRawMany();

    const postViewDto: PostViewModel[] = PostMapper.mapLikes(post);
    return postViewDto[0];
  }

  async findAllByBlogId(
    queryParams: QueryParamsDto,
    blogId: string,
    userId: string = null,
  ): Promise<PageDto<PostViewModel>> {
    const queryBuilder = this.postEntity.createQueryBuilder('post');

    queryBuilder
      .select(['post', 'likesCount', 'likes', 'blog.name as "post_blogName"'])
      .where('post.blogId = :blogId', { blogId })
      .leftJoin('post.blog', 'blog')
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select([
              'l."parentId"',
              `COUNT(*) FILTER( where l."likeStatus" = 'Like')::int AS "post_likesCount" ,
               COUNT(*) FILTER( where l."likeStatus" = 'Dislike')::int AS "post_dislikesCount"`,
            ])
            .from(Like, 'l')
            .groupBy('l."parentId"');
        },
        'likesCount',
        '"likesCount"."parentId" = post.id',
      )
      .addSelect((subQuery) => {
        return subQuery
          .select('l.likeStatus as "post_myStatus"')
          .from(Like, 'l')
          .where('post.id = l.parentId and l.userId = :userId', { userId });
      })
      .leftJoin(
        (db) => {
          return db
            .select(['l', 'user.login as "l_userLogin"'])
            .from(Like, 'l')
            .where(`l.parentType = 'post' and l.likeStatus = 'Like'`)
            .leftJoin('l.user', 'user')
            .orderBy('l.addedAt', 'DESC')
            .limit(3)
            .offset(0);
        },
        'likes',
        '"likes"."l_parentId" = post.id',
      )
      .orderBy('likes."l_addedAt"', 'DESC') //for Likes
      .addOrderBy(`post.${queryParams.sortByField(SortFieldsPostModel)}`, queryParams.order)
      .limit(queryParams.pageSize)
      .offset(queryParams.skip);

    const totalCount = await queryBuilder.getCount();
    const posts: PostRawQuery[] = await queryBuilder.getRawMany();

    const postsViewDto: PostViewModel[] = PostMapper.mapLikes(posts);

    return new PageDto(postsViewDto, queryParams, totalCount);
  }
}
