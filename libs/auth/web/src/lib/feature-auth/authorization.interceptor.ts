import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { isBefore } from 'date-fns';
import { Observable, catchError, concatMap, throwError } from 'rxjs';
import { AuthorizationStore } from '../data-access/store/authorization.store';
import { isAuthPath } from '../utils/auth-url.utils';

export const authorizationInterceptor = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const authStore = inject(AuthorizationStore);
  const refreshExp = authStore.refreshTokenExpiresAt();

  request = request.clone({
    withCredentials: true,
  });
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        !isAuthPath(request.url) &&
        error?.status === 401 &&
        refreshExp &&
        isBefore(new Date(), refreshExp)
      ) {
        return authStore.refreshToken().pipe(concatMap(() => next(request)));
      }
      return throwError(() => error);
    }),
  );
};
