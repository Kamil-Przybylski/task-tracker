import { IRefreshTokenReq, IRefreshTokenRes } from '@libs/auth-shared';
import { JwtToken } from '@libs/shared';
import { IsString } from 'class-validator';

export class RefreshTokenReqDto implements IRefreshTokenReq {
  @IsString()
  refreshToken!: JwtToken;
}

export class RefreshTokenResDto implements IRefreshTokenRes {
  accessToken!: JwtToken;

  constructor(payload: IRefreshTokenRes) {
    Object.assign(this, payload);
  }
}
