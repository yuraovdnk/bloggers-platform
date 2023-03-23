import { BlogBanList } from '../../../../blogs/domain/entity/blogBanList.entity';

export class BannedUsersForBlogViewModel {
  id: string;
  login: string;
  banInfo: {
    isBanned: boolean;
    banDate: Date;
    banReason: string;
  };
  constructor(model: BlogBanList) {
    this.id = model.userId;
    this.login = model.user.login;
    this.banInfo = {
      isBanned: model.isBanned,
      banDate: model.banDate,
      banReason: model.banReason,
    };
  }
}
