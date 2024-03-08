import { Route } from '@angular/router';
import { AuthRoutesEnum } from '@libs/auth-shared';

export const appRoutes: Route[] = [
  {
    path: AuthRoutesEnum.AUTH,
    // canActivate: [authenticationGuardFunction],
    loadChildren: () =>
      import('./pages/authentication/authentication-page.routes'),
  },
];
