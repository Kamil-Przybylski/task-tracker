import { IConfig } from '@libs/core-web';

export const environment: IConfig = {
  production: true,
  apiUrl: '',

  userInactivityTime: 1000 * 60 * 60 * 12,
};
