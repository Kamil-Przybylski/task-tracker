import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  AuthRoutesEnum,
  IRefreshTokenReq,
  IRefreshTokenRes,
  ISignInReq,
  ISignInRes,
  ISignUpReq,
  ISignUpRes,
} from '@libs/auth-shared';
import { APP_CONFIG } from '@libs/core-web';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  readonly #config = inject(APP_CONFIG);
  readonly #http = inject(HttpClient);
  readonly #url = `${this.#config.apiUrl}/${AuthRoutesEnum.AUTH}`;

  signUp(payload: ISignUpReq): Observable<ISignUpRes> {
    console.log(555, this.#url);

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

  logout(param: number | null): Observable<unknown> {
    if (!param) throw new Error('No userId provided!');
    return this.#http.get<unknown>(
      `${this.#url}/${AuthRoutesEnum.LOGOUT}/${param}`,
    );
  }

  getRefreshToken(payload: IRefreshTokenReq): Observable<IRefreshTokenRes> {
    return this.#http.post<IRefreshTokenRes>(
      `${this.#url}/${AuthRoutesEnum.REFRESH_TOKEN}`,
      payload,
    );
  }

  isAuthPath(url: string) {
    const urlFragments = url.split('/');
    return [AuthRoutesEnum.AUTH].some((fragment) =>
      urlFragments.includes(fragment),
    );
  }
}
