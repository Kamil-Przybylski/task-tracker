import { UserId } from '@libs/shared';

export interface ILoginPayload {
  userId: UserId;
  accessTokenExp: number;
  refreshTokenExp: number;
}
