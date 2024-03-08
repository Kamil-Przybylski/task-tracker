import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationFacadeStore } from '../data-access/facades';
import { ISignInFormPayload } from '../models';
import { AwSignInFormComponent } from '../ui/sign-in-form';
import { AwFeatureSignInComponent } from './feature-sign-in.component';

jest.mock('../data-access/facades');
jest.mock('../ui/sign-in-form');

describe('AwFeatureSignInComponent', () => {
  let component: AwFeatureSignInComponent;
  let fixture: ComponentFixture<AwFeatureSignInComponent>;
  let authFacade: AuthenticationFacadeStore;

  beforeEach(async () => {
    TestBed.overrideComponent(AwFeatureSignInComponent, {
      set: {
        imports: [AwSignInFormComponent, RouterTestingModule],
        providers: [AuthenticationFacadeStore, provideNoopAnimations()],
        schemas: [NO_ERRORS_SCHEMA],
      },
    });
    fixture = TestBed.createComponent(AwFeatureSignInComponent);
    component = fixture.componentInstance;
    authFacade = fixture.componentRef.injector.get(AuthenticationFacadeStore);

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correct init the view', () => {
    const submitBtn = fixture.debugElement.query(
      By.css('[data-tid="submit-btn"]'),
    );
    expect(submitBtn).toBeTruthy();
    expect(submitBtn.nativeElement.disabled).not.toBeTruthy();
  });

  it('should submit the form', () => {
    const payload: ISignInFormPayload = {
      email: 'em',
      password: 'pass',
    };
    const formComponentDe = fixture.debugElement.query(
      By.directive(AwSignInFormComponent),
    );
    const formComponent: AwSignInFormComponent =
      formComponentDe.componentInstance;
    jest.spyOn(formComponent, 'submit').mockImplementation(() => null);
    jest.spyOn(authFacade, 'signIn');

    const submitBtn = fixture.debugElement.query(
      By.css('[data-tid="submit-btn"]'),
    );
    submitBtn.nativeElement.click();
    formComponentDe.triggerEventHandler('bySubmit', payload);

    expect(formComponent.submit).toHaveBeenCalledTimes(1);
    expect(authFacade.signIn).toHaveBeenCalledTimes(1);
    expect(authFacade.signIn).toHaveBeenCalledWith(payload);
  });
});
