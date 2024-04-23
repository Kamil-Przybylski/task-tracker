import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TestUtils } from '@libs/shared-web';
import { UiSignInFormComponent } from './ui-sign-in-form.component';

describe('UiSignInFormComponent', () => {
  let fixture: ComponentFixture<UiSignInFormComponent>;
  let componentRef: ComponentRef<UiSignInFormComponent>;
  let component: UiSignInFormComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UiSignInFormComponent],
      providers: [provideNoopAnimations()],
    });
    fixture = TestBed.createComponent(UiSignInFormComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    jest.spyOn(component.bySubmit, 'emit');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
    const matErrors = fixture.debugElement.queryAll(
      By.css('[data-test-id="input-error"]'),
    );
    expect(matErrors.length).toBe(0);
  });

  it('should view errors from input validators', () => {
    const inputEmail: HTMLInputElement = fixture.debugElement.query(
      By.css('[data-test-id="input-email"]'),
    ).nativeElement;
    TestUtils.setInputValue(inputEmail, 'bad.email');
    fixture.detectChanges();

    const inputPassword: HTMLInputElement = fixture.debugElement.query(
      By.css('[data-test-id="input-password"]'),
    ).nativeElement;
    TestUtils.setInputValue(inputPassword, '123');
    fixture.detectChanges();

    const errors: HTMLElement[] = fixture.debugElement
      .queryAll(By.css('[data-test-id="input-error"]'))
      .map((de) => de.nativeElement);

    expect(errors.length).toBe(2);
    expect(errors[0].getAttribute('data-test-value')).toBe('invalidEmail');
    expect(errors[1].getAttribute('data-test-value')).toContain('minlength');
  });

  it('should not show errors if form is valid', () => {
    const inputEmail: HTMLInputElement = fixture.debugElement.query(
      By.css('[data-test-id="input-email"]'),
    ).nativeElement;
    TestUtils.setInputValue(inputEmail, 'good@email.com');
    fixture.detectChanges();

    const inputPassword: HTMLInputElement = fixture.debugElement.query(
      By.css('[data-test-id="input-password"]'),
    ).nativeElement;
    TestUtils.setInputValue(inputPassword, 'pass');
    fixture.detectChanges();

    const errors: HTMLElement[] = fixture.debugElement
      .queryAll(By.css('[data-test-id="input-error"]'))
      .map((de) => de.nativeElement);
    expect(errors.length).toBe(0);
  });

  it('should view errors and prevent emit after submit invalid form', () => {
    component.submit();
    fixture.detectChanges();

    const errors: HTMLElement[] = fixture.debugElement
      .queryAll(By.css('[data-test-id="input-error"]'))
      .map((de) => de.nativeElement);

    expect(errors.length).toBe(2);
    expect(errors[0].getAttribute('data-test-value')).toBe('required');
    expect(errors[1].getAttribute('data-test-value')).toBe('required');
    expect(component.bySubmit.emit).toHaveBeenCalledTimes(0);
  });

  it('should correct dispatch payload after submit valid form', () => {
    const inputEmail: HTMLInputElement = fixture.debugElement.query(
      By.css('[data-test-id="input-email"]'),
    ).nativeElement;
    TestUtils.setInputValue(inputEmail, 'good@email.com');
    fixture.detectChanges();

    const inputPassword: HTMLInputElement = fixture.debugElement.query(
      By.css('[data-test-id="input-password"]'),
    ).nativeElement;
    TestUtils.setInputValue(inputPassword, 'pass');
    fixture.detectChanges();

    component.submit();
    fixture.detectChanges();
    expect(component.bySubmit.emit).toHaveBeenCalledTimes(1);
    expect(component.bySubmit.emit).toHaveBeenCalledWith({
      email: 'good@email.com',
      password: 'pass',
    });
  });

  it('should disable the form', () => {
    componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const inputEmail: HTMLInputElement = fixture.debugElement.query(
      By.css('[data-test-id="input-email"]'),
    ).nativeElement;
    const inputPassword: HTMLInputElement = fixture.debugElement.query(
      By.css('[data-test-id="input-password"]'),
    ).nativeElement;

    expect(inputEmail.hasAttribute('disabled')).toBe(true);
    expect(inputPassword.hasAttribute('disabled')).toBe(true);
  });
});
