import { BlogViewModel } from './blog-view.model';
import { Blog } from '../../../domain/entity/blog.entity';

export class SaBlogViewModel extends BlogViewModel {
  blogOwnerInfo: {
    userId: string;
    userLogin: string;
  };
  banInfo: {
    isBanned: boolean;
    banDate: Date;
  };
  constructor(model: Blog) {
    super(model);
    this.blogOwnerInfo = {
      userId: model.user.id,
      userLogin: model.user.login,
    };
    this.banInfo = {
      isBanned: model.banInfo?.isBanned ?? false,
      banDate: model.banInfo?.banDate ?? null,
    };
  }
}
