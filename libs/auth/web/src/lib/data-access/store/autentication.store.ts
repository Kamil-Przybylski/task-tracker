import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthRoutesEnum, ISignInReq, ISignUpReq } from '@libs/auth-shared';
import {
  ITokenPayloadDto,
  TokenUtils,
  withRequestStatus,
} from '@libs/shared-web';
import { tapResponse } from '@ngrx/operators';
import { signalStore, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { AuthApiService } from '../auth-api.service';
import { AuthorizationFacadeStore } from './authorization.store';

export const AuthenticationStore = signalStore(
  { providedIn: 'root' },
  withRequestStatus(),
  withMethods((store) => {
    const authService = inject(AuthApiService);
    const authorizationStore = inject(AuthorizationFacadeStore);
    const router = inject(Router);

    return {
      signUp: rxMethod<ISignUpReq>(
        pipe(
          tap(() => store.setPending()),
          switchMap((payload) =>
            authService.signUp(payload).pipe(
              tapResponse({
                next: () => {
                  store.setFulfilled();
                  router.navigate([
                    AuthRoutesEnum.AUTH,
                    AuthRoutesEnum.SING_IN,
                  ]);
                },
                error: (error: HttpErrorResponse) =>
                  store.setError(error.message || 'Unknown sign up error'),
              }),
            ),
          ),
        ),
      ),
      signIn: rxMethod<ISignInReq>(
        pipe(
          tap(() => store.setPending()),
          switchMap((payload) =>
            authService.signIn(payload).pipe(
              tapResponse({
                next: (dto) => {
                  const decoded = TokenUtils.decodeToken<ITokenPayloadDto>(
                    dto.accessToken,
                  );
                  authorizationStore.login(decoded.expTime);
                  store.setPending();
                  // router.navigate(['']);
                },
                error: (error: HttpErrorResponse) =>
                  store.setError(error.message || 'Unknown sign in error'),
              }),
            ),
          ),
        ),
      ),
    };
  }),
);
