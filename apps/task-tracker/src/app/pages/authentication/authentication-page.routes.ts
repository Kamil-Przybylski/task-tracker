import { Routes } from '@angular/router';
import { AuthRoutesEnum } from '@libs/auth-shared';

const authenticationPageRoutes: Routes = [
  {
    path: '',
    redirectTo: AuthRoutesEnum.SING_IN,
    pathMatch: 'full',
  },
  {
    path: AuthRoutesEnum.SING_IN,
    loadComponent: () =>
      import('./sign-in/sign-in.component').then((c) => c.SignInComponent),
  },
  {
    path: AuthRoutesEnum.SING_UP,
    loadComponent: () =>
      import('./sign-up/sign-up.component').then((c) => c.SignUpComponent),
  },
];

export default authenticationPageRoutes;
