import { IConfig } from '@libs/core-web/config';

export const environment: IConfig = {
  production: false,
  apiUrl: 'http://localhost:3900/api',

  userInactivityTime: 1000 * 60 * 60 * 12,
};
