import { ILocalStorage } from './local-storage.models';

export abstract class LocalStorage {
  static getItem<T extends keyof ILocalStorage>(key: T): ILocalStorage[T] | null {
    return JSON.parse(localStorage.getItem(key) as ILocalStorage[T]);
  }

  static setItem<T extends keyof ILocalStorage>(key: T, data: ILocalStorage[T]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  static removeItem<T extends keyof ILocalStorage>(key: T): void {
    localStorage.removeItem(key);
  }
}
