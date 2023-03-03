import { BlogViewModel } from './blog-view.model';

export class SaBlogViewModel extends BlogViewModel {
  blogOwnerInfo: {
    userId: string;
    userLogin: string;
  };

  constructor(model: any) {
    super(model);
    this.blogOwnerInfo = {
      userId: model.user.id,
      userLogin: model.user.login,
    };
  }
}
