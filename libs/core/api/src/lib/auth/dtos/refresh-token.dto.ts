import { IRefreshTokenRes } from '@libs/core-shared';

export class RefreshTokenResDto implements IRefreshTokenRes {
  accessTokenExp!: number;

  constructor(accessTokenExp: number) {
    this.accessTokenExp = accessTokenExp;
  }
}
