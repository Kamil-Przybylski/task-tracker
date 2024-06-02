import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed, fakeAsync } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import {
  AuthenticationRoutesEnum,
  ISignInReqDto,
  ISignInResDto,
  ISignUpReqDto,
} from '@libs/authentication-shared';
import { AuthRoutesEnum, IUser } from '@libs/core-shared';
import { AuthAccessService } from '@libs/core-web/auth';
import { APP_CONFIG } from '@libs/core-web/config';
import { UserId } from '@libs/shared';
import { MockService } from 'ng-mocks';
import { AuthenticationStore } from './authentication.store';

describe('AuthenticationStore', () => {
  let httpController: HttpTestingController;

  const setup = () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideRouter([
          {
            path: `${AuthRoutesEnum.AUTH}/${AuthenticationRoutesEnum.SING_IN}`,
            component: class {},
          },
        ]),
        { provide: APP_CONFIG, useValue: { apiUrl: 'https://test.com' } },
        {
          provide: AuthAccessService,
          useValue: MockService(AuthAccessService),
        },
        AuthenticationStore,
      ],
    });
    const store = TestBed.inject(AuthenticationStore);
    const authAccessService = TestBed.inject(AuthAccessService);
    const router = TestBed.inject(Router);
    httpController = TestBed.inject(HttpTestingController);

    return { store, authAccessService, router };
  };

  afterEach(() => {
    httpController.verify();
  });

  it('should create a store', () => {
    const { store } = setup();
    expect(store).toBeDefined();
  });

  describe('signUp', () => {
    it('should handle sign up with success', () => {
      const { store, router } = setup();
      const payload: ISignUpReqDto = {
        username: 'user',
        email: 'test@ema.il',
        password: 'pass',
      };
      const res: IUser = {
        id: 1 as UserId,
        username: '',
        email: '',
        createdDate: new Date(),
        updatedDate: new Date(),
      };
      const routerSpy = jest.spyOn(router, 'navigate');

      expect(store.isPending()).toBe(false);

      store.signUp(payload);
      expect(store.isPending()).toBe(true);

      const req = httpController.expectOne(`https://test.com/auth/sing-up`);
      req.flush(res);

      expect(store.isPending()).toBe(false);
      expect(routerSpy).toHaveBeenCalledWith([
        AuthRoutesEnum.AUTH,
        AuthenticationRoutesEnum.SING_IN,
      ]);
    });

    it('should handle error when sign up fails', () => {
      const { store } = setup();
      const payload: ISignUpReqDto = {
        username: 'user',
        email: 'test@ema.il',
        password: 'pass',
      };

      expect(store.isPending()).toBe(false);

      store.signUp(payload);
      expect(store.isPending()).toBe(true);
      const req = httpController.expectOne(`https://test.com/auth/sing-up`);
      req.flush('Server Error', { status: 409, statusText: 'Email exist' });

      expect(store.isPending()).toBe(false);
      expect(store.error()).toBe(
        'Http failure response for https://test.com/auth/sing-up: 409 Email exist',
      );
    });
  });

  describe('signIn', () => {
    it('should handle sign in with success', () => {
      const { store, authAccessService, router } = setup();
      const payload: ISignInReqDto = {
        email: 'test@ema.il',
        password: 'pass',
      };
      const res: ISignInResDto = {
        userId: 1 as UserId,
        accessTokenExp: 0,
        refreshTokenExp: 0,
      };
      const routerSpy = jest.spyOn(router, 'navigate');
      const loginSpy = jest.spyOn(authAccessService, 'login');

      expect(store.isPending()).toBe(false);

      store.signIn(payload);
      expect(store.isPending()).toBe(true);
      const req = httpController.expectOne(`https://test.com/auth/sing-in`);
      req.flush(res);

      expect(store.isPending()).toBe(false);
      expect(loginSpy).toHaveBeenCalledWith(res);
      expect(routerSpy).toHaveBeenCalledWith(['']);
    });

    it('should handle error when sign in fails', fakeAsync(() => {
      const { store } = setup();
      const payload: ISignUpReqDto = {
        username: 'user',
        email: 'test@ema.il',
        password: 'pass',
      };

      expect(store.isPending()).toBe(false);

      store.signIn(payload);
      expect(store.isPending()).toBe(true);
      const req = httpController.expectOne(`https://test.com/auth/sing-in`);
      req.flush('Server Error', { status: 401, statusText: 'Unauthorized ' });

      expect(store.isPending()).toBe(false);
      expect(store.error()).toBe(
        'Http failure response for https://test.com/auth/sing-in: 401 Unauthorized ',
      );
    }));
  });
});
