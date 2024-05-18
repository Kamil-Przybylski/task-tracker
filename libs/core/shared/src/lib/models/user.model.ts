import { IBase, UserId } from '@libs/shared';

export interface IUser extends IBase<UserId> {
  username: string;
  email: string;
}
