import { PostViewModel } from '../../dto/post-view.model';
import { PostRawQuery } from '../../typing/posts.type';

export class PostMapper {
  static mapLikes(posts: PostRawQuery[]): PostViewModel[] {
    const resultMapping = [];
    const addedPosts = {};

    for (const post of posts) {
      let existingPost = addedPosts[post.post_id];
      if (!existingPost) {
        existingPost = new PostViewModel(post);
        resultMapping.push(existingPost);
        addedPosts[post.post_id] = existingPost;
      }
      if (existingPost.extendedLikesInfo.likesCount) {
        existingPost.extendedLikesInfo.newestLikes.push({
          userId: post.l_userId,
          login: post.l_userLogin,
          addedAt: post.l_addedAt,
        });
      }
    }
    return resultMapping;
  }
}
