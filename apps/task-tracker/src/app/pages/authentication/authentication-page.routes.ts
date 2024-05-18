import { Routes } from '@angular/router';
import { AuthenticationRoutesEnum } from '@libs/authentication-shared';

const authenticationPageRoutes: Routes = [
  {
    path: '',
    redirectTo: AuthenticationRoutesEnum.SING_IN,
    pathMatch: 'full',
  },
  {
    path: AuthenticationRoutesEnum.SING_IN,
    loadComponent: () =>
      import('./sign-in/sign-in.component').then((c) => c.SignInComponent),
  },
  {
    path: AuthenticationRoutesEnum.SING_UP,
    loadComponent: () =>
      import('./sign-up/sign-up.component').then((c) => c.SignUpComponent),
  },
];

export default authenticationPageRoutes;
