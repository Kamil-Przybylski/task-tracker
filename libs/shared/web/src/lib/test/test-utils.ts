import { Observable, delay, map, of } from 'rxjs';

export abstract class TestUtils {
  static setInputValue(inputElement: HTMLInputElement, value: string): void {
    inputElement.value = value;
    inputElement.dispatchEvent(new Event('input'));
    inputElement.dispatchEvent(new Event('blur'));
  }

  static implementationOfAsync<T>(
    res: T,
    throwError?: Error,
  ): () => Observable<T> {
    return () =>
      of(res).pipe(
        delay(0),
        map(() => {
          if (throwError) throw throwError;
          return res as T;
        }),
      );
  }
}
