import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthorizationStore } from '../../data-access/store/authorization.store';
import { AUTH_REDIRECT_PATH_TOKEN } from '../auth.token';

export const authGuardFunction: CanActivateFn = (): boolean => {
  const router = inject(Router);
  const authStore = inject(AuthorizationStore);
  const redirect = inject(AUTH_REDIRECT_PATH_TOKEN);

  if (authStore.userId()) {
    return true;
  } else {
    router.navigate(redirect);
    return false;
  }
};

export const authenticationGuardFunction: CanActivateFn = (): boolean => {
  const router = inject(Router);
  const authStore = inject(AuthorizationStore);

  if (authStore.userId()) {
    router.navigate([]);
    return false;
  } else {
    return true;
  }
};
