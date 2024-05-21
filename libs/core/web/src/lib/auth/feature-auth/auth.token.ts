import { InjectionToken } from '@angular/core';

export const AUTH_REDIRECT_PATH_TOKEN = new InjectionToken<string[]>(
  'auth-redirect-path',
);
