import { RawQueryComment } from '../../../../comments/application/types/comments.type';
import { RawQueryPost } from '../../../../posts/application/types/posts.type';

export class BloggerCommentViewModel {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };
  createdAt: Date;
  postInfo: {
    id: string;
    title: string;
    blogId: string;
    blogName: string;
  };
  constructor(model: RawQueryComment & RawQueryPost & any) {
    this.id = model.comment_id;
    this.content = model.comment_content;
    this.commentatorInfo = {
      userId: model.comment_userId,
      userLogin: model.user_login,
    };
    this.likesInfo = {
      likesCount: model.comment_likesCount,
      dislikesCount: model.comment_dislikesCount,
      myStatus: model.myStatus ?? 'None',
    };
    this.createdAt = model.comment_createdAt;
    this.postInfo = {
      id: model.post_id,
      title: model.post_title,
      blogId: model.post_blogId,
      blogName: model.blog_name,
    };
  }
}
