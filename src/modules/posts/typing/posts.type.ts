export type DbPostDto = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export class SortFieldsPostModel {
  title = 'title';
  shortDescription = 'shortDescription';
  content = 'content';
  blogName = 'blogName';
  createdAt = 'createdAt';
}

export type PostRawQuery = {
  post_id: string;
  post_createdAt: Date;
  post_title: string;
  post_shortDescription: string;
  post_content: string;
  post_blogId: string;
  parentId: string;
  post_likesCount: number;
  post_dislikesCount: number;
  l_id: string;
  l_parentId: string;
  l_parentType: string;
  l_likeStatus: string;
  l_userId: string;
  l_addedAt: Date;
  l_userLogin: string;
  post_blogName: string;
  post_myStatus: string;
};
