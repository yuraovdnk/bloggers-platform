import { User } from '../../../domain/entity/user.entity';

export class UserViewModel {
  id: string;
  login: string;
  email: string;
  createdAt: Date;
  banInfo: {
    isBanned: boolean;
    banDate: Date;
    banReason: string;
  };

  constructor(user: User) {
    this.id = user.id;
    this.login = user.login;
    this.email = user.email;
    this.createdAt = user.createdAt;
    this.banInfo = {
      isBanned: !!user.banInfo?.isBanned,
      banDate: user.banInfo?.banDate ?? null,
      banReason: user.banInfo?.banReason ?? null,
    };
  }
}
