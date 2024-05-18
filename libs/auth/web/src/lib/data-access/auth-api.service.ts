import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  AuthRoutesEnum,
  IRefreshTokenRes,
  ISignInReq,
  ISignInRes,
  ISignUpReq,
  ISignUpRes,
} from '@libs/auth-shared';
import { APP_CONFIG } from '@libs/core-web';
import { UserId } from '@libs/shared';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  readonly #config = inject(APP_CONFIG);
  readonly #http = inject(HttpClient);
  readonly #url = `${this.#config.apiUrl}/${AuthRoutesEnum.AUTH}`;

  signUp(payload: ISignUpReq): Observable<ISignUpRes> {
    return this.#http.post<ISignUpRes>(
      `${this.#url}/${AuthRoutesEnum.SING_UP}`,
      payload,
    );
  }

  signIn(payload: ISignInReq): Observable<ISignInRes> {
    return this.#http.post<ISignInRes>(
      `${this.#url}/${AuthRoutesEnum.SING_IN}`,
      payload,
    );
  }

  logout(userId: UserId | null): Observable<unknown> {
    if (!userId) return of(null);
    return this.#http.get<unknown>(
      `${this.#url}/${AuthRoutesEnum.LOGOUT}/${userId}`,
    );
  }

  getRefreshToken(): Observable<IRefreshTokenRes> {
    return this.#http.get<IRefreshTokenRes>(
      `${this.#url}/${AuthRoutesEnum.REFRESH_TOKEN}`,
    );
  }

  test() {
    return this.#http.get(`${this.#config.apiUrl}`);
  }
}
