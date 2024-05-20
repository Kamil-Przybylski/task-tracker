import { TestBed } from '@angular/core/testing';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Router, provideRouter } from '@angular/router';
import { ngMocks } from 'ng-mocks';
import { ISignInFormPayload } from '../models';
import { UiSignInFormComponent } from '../ui/sign-in-form/ui-sign-in-form.component';
import { FeatureSignInComponent } from './feature-sign-in.component';

jest.mock('../data-access/authentication.store');

describe('FeatureSignInComponent', () => {
  const SIGN_UP_PATH = 'auth/sing-up';

  const setup = () => {
    TestBed.configureTestingModule({
      imports: [FeatureSignInComponent],
      providers: [
        provideNoopAnimations(),
        provideRouter([
          { path: '', component: FeatureSignInComponent },
          { path: SIGN_UP_PATH, component: FeatureSignInComponent },
        ]),
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(FeatureSignInComponent);
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
      ngMocks.find('[data-test-id="button-sign-up"]').nativeElement.disabled,
    ).toBe(false);
    expect(
      ngMocks.find('[data-test-id="progress-bar"]').classes['invisible'],
    ).toBeDefined();
  });

  it('should redirect to "auth/sing-up" by click "Sign up" button', () => {
    const { router } = setup();
    const signUpButton: HTMLButtonElement = ngMocks.find(
      '[data-test-id="button-sign-up"]',
    ).nativeElement;
    signUpButton.click();

    expect(router.url).toEqual(`/${SIGN_UP_PATH}`);
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

  it('should handle submit when SignInForm emit payload', () => {
    const { fixture, component } = setup();
    const handleSubmitSpy = jest.spyOn(component, 'handleSubmit');

    const signInForm: UiSignInFormComponent = ngMocks.find(
      '[data-test-id="sign-in-form"]',
    ).componentInstance;
    const payload: ISignInFormPayload = {
      email: 'user@email.com',
      password: 'password',
    };
    jest
      .spyOn(signInForm, 'submit')
      .mockImplementation(() => signInForm.bySubmit.emit(payload));

    const buttonSubmit: HTMLButtonElement = ngMocks.find(
      '[data-test-id="button-submit"]',
    ).nativeElement;
    buttonSubmit.click();
    fixture.detectChanges();

    expect(component.isPending()).toBe(true);
    expect(handleSubmitSpy).toHaveBeenCalledWith(payload);

    expect(buttonSubmit.disabled).toBe(true);
    expect(
      ngMocks.find('[data-test-id="button-sign-up"]').nativeElement.disabled,
    ).toBe(true);
    expect(
      ngMocks.find('[data-test-id="progress-bar"]').classes['invisible'],
    ).not.toBeDefined();
  });
});
