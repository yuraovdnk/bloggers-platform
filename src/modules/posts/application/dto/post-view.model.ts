import { PostRawQuery } from '../types/posts.type';
import { log } from 'util';

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
    newestLikes: any[];
  };

  constructor(model: PostRawQuery) {
    console.log('1');
    this.id = model.post_id;
    this.title = model.post_title;
    this.shortDescription = model.post_shortDescription;
    this.content = model.post_content;
    this.blogId = model.post_blogId;
    this.blogName = model.post_blogName;
    this.createdAt = model.post_createdAt;
    this.extendedLikesInfo = {
      likesCount: model.post_likesCount,
      dislikesCount: model.post_dislikesCount,
      myStatus: model.post_myStatus ?? 'None',
      newestLikes: [...model.post_newestLikes],
    };
  }
}
