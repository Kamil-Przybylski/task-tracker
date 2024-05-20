import { Injectable, signal } from '@angular/core';
import { UserId } from '@libs/shared';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  userId = signal<UserId | null>(null);
  login() {}
}
