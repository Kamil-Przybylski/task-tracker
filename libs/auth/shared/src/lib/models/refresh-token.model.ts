import { JwtToken } from '@libs/shared';

export interface IRefreshTokenReq {
  refreshToken: JwtToken;
}

export interface IRefreshTokenRes {
  accessToken: JwtToken;
}
