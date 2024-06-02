import { IConfig } from '@libs/core-web/config';

export const environment: IConfig = {
  production: true,
  apiUrl: '',

  userInactivityTime: 1000 * 60 * 60 * 12,
};
