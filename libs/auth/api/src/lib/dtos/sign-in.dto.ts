import { ISignInReq, ISignInRes } from '@libs/auth-shared';
import { UserId } from '@libs/shared';
import { IsString, MinLength } from 'class-validator';

export class SignInReqDto implements ISignInReq {
  @IsString()
  @MinLength(6)
  email!: string;

  @IsString()
  @MinLength(3)
  password!: string;
}

export class SignInResDto implements ISignInRes {
  userId: UserId;
  accessTokenExp: number;
  refreshTokenExp: number;

  constructor(payload: ISignInRes) {
    this.userId = payload.userId;
    this.accessTokenExp = payload.accessTokenExp;
    this.refreshTokenExp = payload.refreshTokenExp;
  }
}
