import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthRoutesEnum, IRefreshTokenRes } from '@libs/core-shared';
import { UserId } from '@libs/shared';
import { Observable, of } from 'rxjs';
import { APP_CONFIG } from '../../config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly #config = inject(APP_CONFIG);
  readonly #http = inject(HttpClient);
  readonly #url = `${this.#config.apiUrl}/${AuthRoutesEnum.AUTH}`;

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
