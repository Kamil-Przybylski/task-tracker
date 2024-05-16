import { UserId } from '@libs/shared';

export interface ITokenPayloadDto {
  sub: UserId;
  exp: number;
  iat?: number;
}
