import { UserId } from '@libs/shared';

export interface ISignInReq {
  email: string;
  password: string;
}

export interface ISignInRes {
  userId: UserId;
  accessTokenExp: number;
  refreshTokenExp: number;
}
