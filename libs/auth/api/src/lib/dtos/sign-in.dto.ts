import { ISignInReq, ISignInRes, IUser } from '@libs/auth-shared';
import { JwtToken } from '@libs/shared';
import { Type } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';
import { UserResDto } from './user.dto';

export class SignInReqDto implements ISignInReq {
  @IsString()
  @MinLength(6)
  email!: string;

  @IsString()
  @MinLength(3)
  password!: string;
}

export class SignInResDto implements ISignInRes {
  @Type(() => UserResDto)
  user!: IUser;

  accessToken!: JwtToken;
  refreshToken!: JwtToken;

  constructor(payload: ISignInRes) {
    Object.assign(this, payload);
  }
}
