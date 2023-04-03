import { Comment } from '../../../../comments/domain/entity/comment.entity';

export class BloggerCommentViewModel {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: Date;
  postInfo: {
    id: string;
    title: string;
    blogId: string;
    blogName: string;
  };
  constructor(model: Comment) {
    this.id = model.id;
    this.content = model.content;
    this.commentatorInfo = {
      userId: model.userId,
      userLogin: model.user.login,
    };
    this.createdAt = model.createdAt;
    this.postInfo = {
      id: model.post.id,
      title: model.post.title,
      blogId: model.post.blog.id,
      blogName: model.post.blog.name,
    };
  }
}
