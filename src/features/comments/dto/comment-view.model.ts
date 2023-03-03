import { RawQueryComment } from '../typing/comments.type';

export class CommentViewModel {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: Date;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };
  constructor(item: RawQueryComment | any) {
    this.id = item.comment_id;
    this.content = item.comment_content;
    this.createdAt = item.comment_createdAt;
    this.commentatorInfo = {
      userId: item.comment_userId,
      userLogin: item.user_login,
    };
    this.likesInfo = {
      likesCount: item.likesCount ?? 0,
      dislikesCount: item.dislikesCount ?? 0,
      myStatus: item.myStatus ?? 'None',
    };
  }
}
