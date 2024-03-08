import { JwtToken } from '@libs/shared';
import { IUser } from './user.model';

export interface ISignInReq {
  email: string;
  password: string;
}

export interface ISignInRes {
  user: IUser;
  accessToken: JwtToken;
  refreshToken: JwtToken;
}
