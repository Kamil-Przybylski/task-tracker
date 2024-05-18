import { TestBed } from '@angular/core/testing';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Router, provideRouter } from '@angular/router';
import { ngMocks } from 'ng-mocks';
import { ISignUpFormPayload } from '../models';
import { UiSignUpFormComponent } from '../ui/sign-up-form/ui-sign-up-form.component';
import { FeatureSignUpComponent } from './feature-sign-up.component';

jest.mock('../data-access/store/authentication.store');

describe('FeatureSignUpComponent', () => {
  const SIGN_IN_PATH = 'auth/sing-in';

  const setup = () => {
    TestBed.configureTestingModule({
      imports: [FeatureSignUpComponent],
      providers: [
        provideNoopAnimations(),
        provideRouter([
          { path: '', component: FeatureSignUpComponent },
          { path: SIGN_IN_PATH, component: FeatureSignUpComponent },
        ]),
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(FeatureSignUpComponent);
    const component = fixture.componentInstance;
    const router = TestBed.inject(Router);
    fixture.detectChanges();

    return { fixture, component, router };
  };

  it('should create and init component', () => {
    setup();

    expect(
      ngMocks.find('[data-test-id="button-submit"]').nativeElement.disabled,
    ).toBe(false);
    expect(
      ngMocks.find('[data-test-id="button-sign-in"]').nativeElement.disabled,
    ).toBe(false);
    expect(
      ngMocks.find('[data-test-id="progress-bar"]').classes['invisible'],
    ).toBeDefined();
  });

  it('should redirect to "auth/sing-in" by click "Sign in" button', () => {
    const { router } = setup();
    const signInButton: HTMLButtonElement = ngMocks.find(
      '[data-test-id="button-sign-in"]',
    ).nativeElement;
    signInButton.click();

    expect(router.url).toEqual(`/${SIGN_IN_PATH}`);
  });

  it("should prevent handle submit if forRef doesn't emit payload", () => {
    const { component } = setup();
    const handleSubmitSpy = jest.spyOn(component, 'handleSubmit');

    const buttonSubmit: HTMLButtonElement = ngMocks.find(
      '[data-test-id="button-submit"]',
    ).nativeElement;
    buttonSubmit.click();

    expect(component.isPending()).toBe(false);
    expect(handleSubmitSpy).not.toHaveBeenCalled();
  });

  it('should handle submit when SignUpForm emit payload', () => {
    const { fixture, component } = setup();
    const handleSubmitSpy = jest.spyOn(component, 'handleSubmit');

    const signUpForm: UiSignUpFormComponent = ngMocks.find(
      '[data-test-id="sign-up-form"]',
    ).componentInstance;
    const payload: ISignUpFormPayload = {
      username: 'user',
      email: 'user@email.com',
      password: 'password',
    };
    jest
      .spyOn(signUpForm, 'submit')
      .mockImplementation(() => signUpForm.bySubmit.emit(payload));

    const buttonSubmit: HTMLButtonElement = ngMocks.find(
      '[data-test-id="button-submit"]',
    ).nativeElement;
    buttonSubmit.click();
    fixture.detectChanges();

    expect(component.isPending()).toBe(true);
    expect(handleSubmitSpy).toHaveBeenCalledWith(payload);

    expect(buttonSubmit.disabled).toBe(true);
    expect(
      ngMocks.find('[data-test-id="button-sign-in"]').nativeElement.disabled,
    ).toBe(true);
    expect(
      ngMocks.find('[data-test-id="progress-bar"]').classes['invisible'],
    ).not.toBeDefined();
  });
});
