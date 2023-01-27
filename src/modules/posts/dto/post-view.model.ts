type LikesInfoType = {
  userId: string;
  login: string;
  addedAt: string;
};

export class PostViewModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes?: LikesInfoType[];
  };

  constructor(model: any) {
    this.id = model.post_id;
    this.title = model.post_title;
    this.shortDescription = model.post_shortDescription;
    this.content = model.post_content;
    this.blogId = model.post_blogId;
    this.blogName = model.post_blogName || model.blogName;
    this.createdAt = model.post_createdAt;
    this.extendedLikesInfo = {
      likesCount: model.post_likesCount ?? 0,
      dislikesCount: model.post_dislikesCount ?? 0,
      myStatus: model.post_myStatus ?? 'None',
      newestLikes: [],
    };
  }
}
