export interface IUser {
  id: string;
  email: string;
  login: string;
  passwordHash: string;
  confirmCode: string;
  expirationConfirmCode: Date;
  isConfirmedEmail: boolean;
  createdAt: Date;
  passwordRecoveryCode: string;
  expirationPasswordRecoveryCode: Date;
}
