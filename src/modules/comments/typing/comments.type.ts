export type CommentInputType = {
  content: string;
  postId: string;
  userId: string;
};
export class SortCommentFields {
  createdAt: string;
  content: string;
}

export class RawQueryComment {
  comment_id: string;
  comment_createdAt: Date;
  comment_userId: string;
  comment_postId: string;
  comment_content: string;
  user_login: string;
  parentId: string;
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
}
