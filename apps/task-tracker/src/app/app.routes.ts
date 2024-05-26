import { Route } from '@angular/router';
import { AuthRoutesEnum, CommonRoutesEnum } from '@libs/core-shared';
import { authGuardFunction, authenticationGuardFunction } from '@libs/core-web';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full',
  },
  {
    path: 'app',
    canActivate: [authGuardFunction],
    loadComponent: () => import('./app-component/app.component'),
    children: [
      { path: '', redirectTo: CommonRoutesEnum.HOME, pathMatch: 'full' },
      {
        path: CommonRoutesEnum.HOME,
        loadChildren: () => import('./pages/home/home.routes'),
      },
      {
        path: CommonRoutesEnum.DASHBOARD,
        loadChildren: () => import('./pages/dashboard/dashboard.routes'),
      },
    ],
  },
  {
    path: AuthRoutesEnum.AUTH,
    canActivate: [authenticationGuardFunction],
    loadChildren: () =>
      import('./pages/authentication/authentication-page.routes'),
  },
];
