export type UserInputType = {
  login: string;
  email: string;
  passwordHash: string;
  confirmationCode?: string;
  expirationConfirmCode?: Date;
  isConfirmedEmail: boolean;
};

export class UserModel {
  id: string;
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  confirmationCode: string;
  expirationConfirmCode: Date;
  isConfirmedEmail: boolean;
  passwordRecoveryCode: string;
  expirationPasswordRecoveryCode: Date;
}
