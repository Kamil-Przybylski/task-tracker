import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  AuthenticationRoutesEnum,
  ISignInReq,
  ISignInRes,
  ISignUpReq,
} from '@libs/authentication-shared';
import { AuthRoutesEnum, IUser } from '@libs/core-shared';
import { APP_CONFIG } from '@libs/core-web';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationApiService {
  readonly #config = inject(APP_CONFIG);
  readonly #http = inject(HttpClient);
  readonly #url = `${this.#config.apiUrl}/${AuthRoutesEnum.AUTH}`;

  signUp(payload: ISignUpReq): Observable<IUser> {
    return this.#http.post<IUser>(
      `${this.#url}/${AuthenticationRoutesEnum.SING_UP}`,
      payload,
    );
  }

  signIn(payload: ISignInReq): Observable<ISignInRes> {
    return this.#http.post<ISignInRes>(
      `${this.#url}/${AuthenticationRoutesEnum.SING_IN}`,
      payload,
    );
  }
}
