import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { isAfter } from 'date-fns';
import { Observable, catchError, concatMap, throwError } from 'rxjs';
import { AuthStore } from '../../data-access/auth.store';

export const authorizationInterceptor = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const authStore = inject(AuthStore);
  const refreshExp = authStore.refreshTokenExpiresAt();

  request = request.clone({
    withCredentials: true,
  });
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error?.status === 401) {
        if (!refreshExp || (refreshExp && isAfter(new Date(), refreshExp))) {
          authStore.logout();
          return next(request);
        }
        return authStore.refreshToken().pipe(concatMap(() => next(request)));
      }
      return throwError(() => error);
    }),
  );
};
