export type DbPostDto = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export class SortFieldsPostModel {
  title = 'post.title';
  shortDescription = 'post.shortDescription';
  content = 'post.content';
  blogName = 'blogName';
  createdAt = 'post.createdAt';
}

export type PostRawQuery = {
  post_id: string;
  post_createdAt: Date;
  post_title: string;
  post_shortDescription: string;
  post_content: string;
  post_blogId: string;
  post_blogName: string;
  post_newestLikes: any[];
  post_likesCount: number;
  post_dislikesCount: number;
  post_myStatus: string;
};
