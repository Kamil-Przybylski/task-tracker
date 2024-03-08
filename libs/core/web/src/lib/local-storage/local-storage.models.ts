import { JwtToken } from '@libs/shared';

export interface ILocalStorage {
  accessToken: JwtToken;
  refreshToken: JwtToken;
}
