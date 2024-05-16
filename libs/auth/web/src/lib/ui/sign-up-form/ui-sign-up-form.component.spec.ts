import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TestUtils } from '@libs/shared-web';
import { ngMocks } from 'ng-mocks';
import { UiSignUpFormComponent } from './ui-sign-up-form.component';

describe('UiSignUpFormComponent', () => {
  const setup = () => {
    TestBed.configureTestingModule({
      imports: [UiSignUpFormComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    const fixture = TestBed.createComponent(UiSignUpFormComponent);
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

    const inputUsername: HTMLInputElement = ngMocks.find(
      '[data-test-id="input-username"]',
    ).nativeElement;
    TestUtils.setInputValue(inputUsername, '12');
    fixture.detectChanges();

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

    const inputRepeatPassword: HTMLInputElement = ngMocks.find(
      '[data-test-id="input-repeatPassword"]',
    ).nativeElement;
    TestUtils.setInputValue(inputRepeatPassword, '456');
    fixture.detectChanges();

    expect(
      ngMocks.find('[data-test-id="input-username-minlength"]'),
    ).toBeDefined();
    expect(
      ngMocks.find('[data-test-id="input-email-invalidEmail"]'),
    ).toBeDefined();
    expect(
      ngMocks.find('[data-test-id="input-password-minlength"]'),
    ).toBeDefined();
    expect(
      ngMocks.find('[data-test-id="input-repeatPassword-notEqual"]'),
    ).toBeDefined();

    const errors = ngMocks.findAll('[data-test-type="input-error"]');
    expect(errors.length).toBe(4);
  });

  it('should be valid form for correct inputs', async () => {
    const { fixture } = setup();

    const inputUsername: HTMLInputElement = ngMocks.find(
      '[data-test-id="input-username"]',
    ).nativeElement;
    TestUtils.setInputValue(inputUsername, 'user');
    fixture.detectChanges();

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

    const inputRepeatPassword: HTMLInputElement = ngMocks.find(
      '[data-test-id="input-repeatPassword"]',
    ).nativeElement;
    TestUtils.setInputValue(inputRepeatPassword, 'pass');
    fixture.detectChanges();

    const errors = ngMocks.findAll(fixture, '[data-test-type="input-error"]');
    expect(errors.length).toBe(0);
  });

  it('should view errors and prevent emit after submit an invalid form', async () => {
    const { fixture, component } = setup();
    jest.spyOn(component.bySubmit, 'emit');

    component.submit();
    fixture.detectChanges();

    expect(
      ngMocks.find('[data-test-id="input-username-required"]'),
    ).toBeDefined();
    expect(ngMocks.find('[data-test-id="input-email-required"]')).toBeDefined();
    expect(
      ngMocks.find('[data-test-id="input-password-required"]'),
    ).toBeDefined();
    expect(component.bySubmit.emit).toHaveBeenCalledTimes(0);

    const errors = ngMocks.findAll(fixture, '[data-test-type="input-error"]');
    expect(errors.length).toBe(3);
  });

  it('should correct dispatch payload after submit a valid form', async () => {
    const { fixture, component } = setup();
    jest.spyOn(component.bySubmit, 'emit');

    const inputUsername: HTMLInputElement = ngMocks.find(
      '[data-test-id="input-username"]',
    ).nativeElement;
    TestUtils.setInputValue(inputUsername, 'user');
    fixture.detectChanges();

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

    const inputRepeatPassword: HTMLInputElement = ngMocks.find(
      '[data-test-id="input-repeatPassword"]',
    ).nativeElement;
    TestUtils.setInputValue(inputRepeatPassword, 'pass');
    fixture.detectChanges();

    component.submit();
    fixture.detectChanges();

    expect(component.bySubmit.emit).toHaveBeenCalledTimes(1);
    expect(component.bySubmit.emit).toHaveBeenCalledWith({
      username: 'user',
      email: 'good@email.com',
      password: 'pass',
    });
  });

  it('should disable the form by signal input', async () => {
    const { fixture } = setup();

    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const inputUsername: HTMLInputElement = ngMocks.find(
      '[data-test-id="input-username"]',
    ).nativeElement;

    const inputEmail: HTMLInputElement = ngMocks.find(
      '[data-test-id="input-email"]',
    ).nativeElement;

    const inputPassword: HTMLInputElement = ngMocks.find(
      '[data-test-id="input-password"]',
    ).nativeElement;

    const inputRepeatPassword: HTMLInputElement = ngMocks.find(
      '[data-test-id="input-repeatPassword"]',
    ).nativeElement;

    expect(inputUsername.hasAttribute('disabled')).toBe(true);
    expect(inputEmail.hasAttribute('disabled')).toBe(true);
    expect(inputPassword.hasAttribute('disabled')).toBe(true);
    expect(inputRepeatPassword.hasAttribute('disabled')).toBe(true);
  });
});
