import { Injectable, inject } from '@angular/core';
import { AuthStore } from '../data-access/auth.store';
import { ILoginPayload } from '../models/login.model';

@Injectable({ providedIn: 'root' })
export class AuthAccessService {
  #authStore = inject(AuthStore);

  login(dto: ILoginPayload) {
    return this.#authStore.login(dto);
  }

  logout() {
    return this.#authStore.logout();
  }
}
