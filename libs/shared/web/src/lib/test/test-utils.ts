export abstract class TestUtils {
  static setInputValue(inputElement: HTMLInputElement, value: string): void {
    inputElement.value = value;
    inputElement.dispatchEvent(new Event('input'));
    inputElement.dispatchEvent(new Event('blur'));
  }
}
