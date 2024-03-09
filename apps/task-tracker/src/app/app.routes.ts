import { Route } from '@angular/router';
import { AuthRoutesEnum } from '@libs/auth-shared';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full',
  },
  {
    path: 'app',
    // canActivate: [authGuardFunction],
    loadComponent: () => import('./app-component/app.component'),
  },
  {
    path: AuthRoutesEnum.AUTH,
    // canActivate: [authenticationGuardFunction],
    loadChildren: () =>
      import('./pages/authentication/authentication-page.routes'),
  },
];
