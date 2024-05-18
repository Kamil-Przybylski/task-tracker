import { IRefreshTokenRes } from '@libs/auth-shared';

export class RefreshTokenResDto implements IRefreshTokenRes {
  accessTokenExp!: number;

  constructor(accessTokenExp: number) {
    this.accessTokenExp = accessTokenExp;
  }
}
