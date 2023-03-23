export type DbPostDto = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export class SortFieldsPostModel {
  title = 'blogs.title';
  shortDescription = 'blogs.shortDescription';
  content = 'blogs.content';
  blogName = 'blogName';
  createdAt = 'blogs.createdAt';
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
