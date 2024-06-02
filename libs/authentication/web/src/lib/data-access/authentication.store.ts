import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthenticationRoutesEnum,
  ISignInReqDto,
  ISignUpReqDto,
} from '@libs/authentication-shared';
import { AuthRoutesEnum } from '@libs/core-shared';
import { AuthAccessService } from '@libs/core-web/auth';
import { withRequestStatus } from '@libs/shared-web';
import { tapResponse } from '@ngrx/operators';
import { signalStore, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { AuthenticationApiService } from './authentication-api.service';

export const AuthenticationStore = signalStore(
  { providedIn: 'root' },
  withRequestStatus(),
  withMethods((store) => {
    const authenticationService = inject(AuthenticationApiService);
    const authService = inject(AuthAccessService);
    const router = inject(Router);

    return {
      signUp: rxMethod<ISignUpReqDto>(
        pipe(
          tap(() => store.setPending()),
          switchMap((payload) =>
            authenticationService.signUp(payload).pipe(
              tapResponse({
                next: () => {
                  store.setFulfilled();
                  router.navigate([
                    AuthRoutesEnum.AUTH,
                    AuthenticationRoutesEnum.SING_IN,
                  ]);
                },
                error: (error: HttpErrorResponse) =>
                  store.setError(error.message || 'Unknown sign up error'),
              }),
            ),
          ),
        ),
      ),
      signIn: rxMethod<ISignInReqDto>(
        pipe(
          tap(() => store.setPending()),
          switchMap((payload) =>
            authenticationService.signIn(payload).pipe(
              tapResponse({
                next: (dto) => {
                  authService.login(dto);
                  store.setFulfilled();
                  router.navigate(['']);
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
