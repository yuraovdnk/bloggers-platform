export type UserDbDto = {
  login: string;
  email: string;
  passwordHash: string;
  confirmationCode?: string;
  expirationConfirmCode?: Date;
  isConfirmedEmail: boolean;
};

export class SortFieldUserModel {
  login = 'login';
  email = 'email';
  createdAt = 'createdAt';
}
