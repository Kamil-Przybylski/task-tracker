import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TestUtils } from '@libs/shared-web';
import { ngMocks } from 'ng-mocks';
import { UiSignInFormComponent } from './ui-sign-in-form.component';

describe('UiSignInFormComponent', () => {
  const setup = () => {
    TestBed.configureTestingModule({
      imports: [UiSignInFormComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();
    const fixture = TestBed.createComponent(UiSignInFormComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    return { fixture, component };
  };

  it('should create and init component with a clear form', async () => {
    setup();
    const errors = ngMocks.findAll('[data-test-type="input-error"]');
    expect(errors.length).toBe(0);
  });

  it('should view errors by invalid inputs into the form', async () => {
    const { fixture } = setup();

    const inputEmail: HTMLInputElement = ngMocks.find(
      '[data-test-id="input-email"]',
    ).nativeElement;
    TestUtils.setInputValue(inputEmail, 'bad.email');
    fixture.detectChanges();

    const inputPassword: HTMLInputElement = ngMocks.find(
      '[data-test-id="input-password"]',
    ).nativeElement;
    TestUtils.setInputValue(inputPassword, '123');
    fixture.detectChanges();

    expect(
      ngMocks.find('[data-test-id="input-email-invalidEmail"]'),
    ).toBeDefined();

    expect(
      ngMocks.find('[data-test-id="input-password-minlength"]'),
    ).toBeDefined();

    const errors = ngMocks.findAll('[data-test-type="input-error"]');
    expect(errors.length).toBe(2);
  });

  it('should be valid form for correct inputs', async () => {
    const { fixture } = setup();

    const inputEmail: HTMLInputElement = ngMocks.find(
      '[data-test-id="input-email"]',
    ).nativeElement;
    TestUtils.setInputValue(inputEmail, 'good@email.com');
    fixture.detectChanges();

    const inputPassword: HTMLInputElement = ngMocks.find(
      '[data-test-id="input-password"]',
    ).nativeElement;
    TestUtils.setInputValue(inputPassword, 'pass');
    fixture.detectChanges();

    const errors = ngMocks.findAll(fixture, '[data-test-type="input-error"]');
    expect(errors.length).toBe(0);
  });

  it('should view errors and prevent emit after submit an invalid form', async () => {
    const { fixture, component } = setup();
    jest.spyOn(component.bySubmit, 'emit');

    component.submit();
    fixture.detectChanges();

    expect(ngMocks.find('[data-test-id="input-email-required"]')).toBeDefined();
    expect(
      ngMocks.find('[data-test-id="input-password-required"]'),
    ).toBeDefined();
    expect(component.bySubmit.emit).toHaveBeenCalledTimes(0);

    const errors = ngMocks.findAll(fixture, '[data-test-type="input-error"]');
    expect(errors.length).toBe(2);
  });

  it('should correct dispatch payload after submit a valid form', async () => {
    const { fixture, component } = setup();
    jest.spyOn(component.bySubmit, 'emit');

    const inputEmail: HTMLInputElement = ngMocks.find(
      '[data-test-id="input-email"]',
    ).nativeElement;
    TestUtils.setInputValue(inputEmail, 'good@email.com');
    fixture.detectChanges();

    const inputPassword: HTMLInputElement = ngMocks.find(
      fixture,
      '[data-test-id="input-password"]',
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

  it('should disable the form by signal input', async () => {
    const { fixture } = setup();

    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const inputEmail: HTMLInputElement = ngMocks.find(
      '[data-test-id="input-email"]',
    ).nativeElement;
    const inputPassword: HTMLInputElement = ngMocks.find(
      '[data-test-id="input-password"]',
    ).nativeElement;

    expect(inputEmail.hasAttribute('disabled')).toBe(true);
    expect(inputPassword.hasAttribute('disabled')).toBe(true);
  });
});
