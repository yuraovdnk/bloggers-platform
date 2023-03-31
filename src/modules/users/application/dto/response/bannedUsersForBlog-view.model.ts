import { BlogBlackList } from '../../../../blogs/domain/entity/blogBlackList.entity';

export class BannedUsersForBlogViewModel {
  id: string;
  login: string;
  banInfo: {
    isBanned: boolean;
    banDate: Date;
    banReason: string;
  };
  constructor(model: BlogBlackList) {
    this.id = model.userId;
    this.login = model.user.login;
    this.banInfo = {
      isBanned: model.isBanned,
      banDate: model.banDate,
      banReason: model.banReason,
    };
  }
}
