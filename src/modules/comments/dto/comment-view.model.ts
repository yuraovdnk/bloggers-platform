export class CommentViewModel {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: string;
  likesInfo: {
    likesCount: string;
    dislikesCount: string;
    myStatus: string;
  };
  constructor(item: any) {
    this.id = item.comment_id;
    this.content = item.comment_content;
    this.userId = item.comment_userId;
    this.userLogin = item.user_login;
    this.createdAt = item.comment_createdAt;
    this.likesInfo = {
      likesCount: item.likesCount ?? 0,
      dislikesCount: item.dislikesCount ?? 0,
      myStatus: item.myStatus ?? 'None',
    };
  }
}
