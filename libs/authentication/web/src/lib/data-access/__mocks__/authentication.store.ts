import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthenticationStore {
  isPending = signal(false);
  error = signal(null);
  signIn() {
    this.isPending.set(true);
  }
  signUp() {
    this.isPending.set(true);
  }
}
