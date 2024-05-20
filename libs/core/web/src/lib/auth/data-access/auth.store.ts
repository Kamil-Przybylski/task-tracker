import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserId } from '@libs/shared';
import { LocalStorage } from '@libs/shared-web';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { isBefore } from 'date-fns';
import { exhaustMap, pipe, tap } from 'rxjs';
import { AUTH_REDIRECT_PATH_TOKEN } from '../feature-auth/auth.token';
import { ILoginPayload } from '../models/login.model';
import { isAuthPath } from '../utils/auth-url.utils';
import { AuthApiService } from './auth-api.service';

interface IState {
  userId: UserId | null;
  accessTokenExpiresAt: number | null;
  refreshTokenExpiresAt: number | null;
}

const initialState: IState = {
  userId: null,
  accessTokenExpiresAt: null,
  refreshTokenExpiresAt: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<IState>(initialState),
  withMethods((store) => {
    const authService = inject(AuthApiService);
    const router = inject(Router);
    const redirect = inject(AUTH_REDIRECT_PATH_TOKEN);

    const handleLogout = () => {
      LocalStorage.removeItem('userId');
      LocalStorage.removeItem('accessTokenExpiresAt');
      LocalStorage.removeItem('refreshTokenExpiresAt');
      patchState(store, initialState);

      if (isAuthPath(router.url)) return;
      router.navigate(redirect);
      window.location.reload();
    };

    return {
      login(dto: ILoginPayload): void {
        LocalStorage.setItem('userId', `${dto.userId}`);
        LocalStorage.setItem('accessTokenExpiresAt', `${dto.accessTokenExp}`);
        LocalStorage.setItem('refreshTokenExpiresAt', `${dto.refreshTokenExp}`);

        patchState(store, {
          userId: dto.userId,
          accessTokenExpiresAt: dto.accessTokenExp,
          refreshTokenExpiresAt: dto.refreshTokenExp,
        });
      },
      logout: rxMethod<void>(
        pipe(
          tap(() => {}),
          exhaustMap(() =>
            authService.logout(store.userId()).pipe(
              tapResponse({
                next: () => handleLogout(),
                error: () => handleLogout(),
              }),
            ),
          ),
        ),
      ),
    };
  }),
  withMethods((store) => {
    const authService = inject(AuthApiService);
    return {
      refreshToken: () =>
        authService.getRefreshToken().pipe(
          tapResponse({
            next: (dto) =>
              patchState(store, {
                accessTokenExpiresAt: dto.accessTokenExp,
              }),
            error: () => store.logout(),
          }),
        ),
    };
  }),
  withHooks({
    onInit(store) {
      const userId = +(LocalStorage.getItem('userId') ?? 0) as UserId | null;
      const refreshExp = +(LocalStorage.getItem('refreshTokenExpiresAt') ?? 0);

      if (userId && refreshExp && isBefore(new Date(), refreshExp)) {
        store.refreshToken().subscribe();
        patchState(store, {
          userId: userId,
          refreshTokenExpiresAt: refreshExp,
        });
      } else {
        patchState(store, initialState);
      }
    },
  }),
);
