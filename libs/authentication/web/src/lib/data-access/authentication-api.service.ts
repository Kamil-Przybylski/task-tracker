import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  AuthenticationRoutesEnum,
  ISignInReqDto,
  ISignInResDto,
  ISignUpReqDto,
} from '@libs/authentication-shared';
import { AuthRoutesEnum } from '@libs/core-shared';
import { APP_CONFIG } from '@libs/core-web';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationApiService {
  readonly #config = inject(APP_CONFIG);
  readonly #http = inject(HttpClient);
  readonly #url = `${this.#config.apiUrl}/${AuthRoutesEnum.AUTH}`;

  signUp(payload: ISignUpReqDto): Observable<unknown> {
    return this.#http.post(
      `${this.#url}/${AuthenticationRoutesEnum.SING_UP}`,
      payload,
    );
  }

  signIn(payload: ISignInReqDto): Observable<ISignInResDto> {
    return this.#http.post<ISignInResDto>(
      `${this.#url}/${AuthenticationRoutesEnum.SING_IN}`,
      payload,
    );
  }
}
