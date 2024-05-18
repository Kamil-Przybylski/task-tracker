import { inject } from '@angular/core';
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
import { AuthService } from './auth-api.service';

interface IState {
  userId: UserId | null;
  accessTokenExpiresAt: number | null;
  refreshTokenExpiresAt: number | null;
}

interface ILoginPayload {
  userId: UserId;
  accessTokenExp: number;
  refreshTokenExp: number;
}

const initialState: IState = {
  userId: null,
  accessTokenExpiresAt: null,
  refreshTokenExpiresAt: null,
};

const logoutLocalStorage = () => {
  LocalStorage.removeItem('userId');
  LocalStorage.removeItem('accessTokenExpiresAt');
  LocalStorage.removeItem('refreshTokenExpiresAt');
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<IState>(initialState),
  withMethods((store) => {
    const authService = inject(AuthService);
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
                next: () => {
                  logoutLocalStorage();
                  patchState(store, initialState);
                },
                error: () => {
                  logoutLocalStorage();
                  patchState(store, initialState);
                },
              }),
            ),
          ),
        ),
      ),
    };
  }),
  withMethods((store) => {
    const authService = inject(AuthService);
    return {
      refreshToken: () =>
        authService.getRefreshToken().pipe(
          tapResponse({
            next: (dto) => {
              patchState(store, {
                accessTokenExpiresAt: dto.accessTokenExp,
              });
            },
            error: () => {
              store.logout();
              patchState(store, initialState);
            },
          }),
        ),
    };
  }),
  withHooks({
    onInit(store) {
      const userId = +(LocalStorage.getItem('userId') ?? 0) as UserId | null;
      const refreshExp = +(LocalStorage.getItem('refreshTokenExpiresAt') ?? 0);

      if (userId && refreshExp && isBefore(new Date(), refreshExp)) {
        store.refreshToken();
        patchState(store, {
          userId: userId,
          refreshTokenExpiresAt: refreshExp,
        });
      } else {
        store.logout();
        patchState(store, initialState);
      }
    },
  }),
);
