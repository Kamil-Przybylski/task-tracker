import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import {
  AuthenticationRoutesEnum,
  ISignInReq,
  ISignInRes,
  ISignUpReq,
} from '@libs/authentication-shared';
import { AuthRoutesEnum, IUser } from '@libs/core-shared';
import { AuthAccessService } from '@libs/core-web';
import { UserId } from '@libs/shared';
import { TestUtils } from '@libs/shared-web';
import { MockService } from 'ng-mocks';
import { AuthenticationApiService } from './authentication-api.service';
import { AuthenticationStore } from './authentication.store';

describe('AuthenticationStore', () => {
  const setup = () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: `${AuthRoutesEnum.AUTH}/${AuthenticationRoutesEnum.SING_IN}`,
            component: class {},
          },
        ]),
        {
          provide: AuthenticationApiService,
          useValue: MockService(AuthenticationApiService),
        },
        {
          provide: AuthAccessService,
          useValue: MockService(AuthAccessService),
        },
        AuthenticationStore,
      ],
    });
    const store = TestBed.inject(AuthenticationStore);
    const apiServiceMock = TestBed.inject(AuthenticationApiService);
    const authAccessService = TestBed.inject(AuthAccessService);
    const router = TestBed.inject(Router);

    return { store, apiServiceMock, authAccessService, router };
  };

  it('should create a store', () => {
    const { store } = setup();
    expect(store).toBeDefined();
  });

  describe('signUp', () => {
    it('should handle sign up with success', fakeAsync(() => {
      const { store, apiServiceMock, router } = setup();
      const payload: ISignUpReq = {
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
      const signUpSpy = jest
        .spyOn(apiServiceMock, 'signUp')
        .mockImplementation(TestUtils.implementationOfAsync(res));

      expect(store.isPending()).toBe(false);

      store.signUp(payload);
      expect(store.isPending()).toBe(true);
      expect(signUpSpy).toHaveBeenCalled();
      expect(signUpSpy).toHaveBeenCalledWith(payload);

      tick(0);
      expect(store.isPending()).toBe(false);
      expect(routerSpy).toHaveBeenCalledWith([
        AuthRoutesEnum.AUTH,
        AuthenticationRoutesEnum.SING_IN,
      ]);
    }));

    it('should handle error when sign up fails', fakeAsync(() => {
      const { store, apiServiceMock } = setup();
      const payload: ISignUpReq = {
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
      const signUnSpy = jest
        .spyOn(apiServiceMock, 'signUp')
        .mockImplementation(
          TestUtils.implementationOfAsync(res, new Error('Error')),
        );

      expect(store.isPending()).toBe(false);

      store.signUp(payload);
      expect(store.isPending()).toBe(true);
      expect(signUnSpy).toHaveBeenCalled();
      expect(signUnSpy).toHaveBeenCalledWith(payload);

      tick(0);
      expect(store.isPending()).toBe(false);
      expect(store.error()).toBe('Error');
    }));
  });

  describe('signIn', () => {
    it('should handle sign in with success', fakeAsync(() => {
      const { store, apiServiceMock, authAccessService, router } = setup();
      const payload: ISignInReq = {
        email: 'test@ema.il',
        password: 'pass',
      };
      const res: ISignInRes = {
        userId: 1 as UserId,
        accessTokenExp: 0,
        refreshTokenExp: 0,
      };
      const routerSpy = jest.spyOn(router, 'navigate');
      const signInSpy = jest
        .spyOn(apiServiceMock, 'signIn')
        .mockImplementation(TestUtils.implementationOfAsync(res));
      const loginSpy = jest.spyOn(authAccessService, 'login');

      expect(store.isPending()).toBe(false);

      store.signIn(payload);
      expect(store.isPending()).toBe(true);
      expect(signInSpy).toHaveBeenCalled();
      expect(signInSpy).toHaveBeenCalledWith(payload);

      tick(0);
      expect(store.isPending()).toBe(false);
      expect(loginSpy).toHaveBeenCalledWith(res);
      expect(routerSpy).toHaveBeenCalledWith(['']);
    }));

    it('should handle error when sign in fails', fakeAsync(() => {
      const { store, apiServiceMock } = setup();
      const payload: ISignUpReq = {
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
      const signInSpy = jest
        .spyOn(apiServiceMock, 'signUp')
        .mockImplementation(
          TestUtils.implementationOfAsync(res, new Error('Error')),
        );

      expect(store.isPending()).toBe(false);

      store.signUp(payload);
      expect(store.isPending()).toBe(true);
      expect(signInSpy).toHaveBeenCalled();
      expect(signInSpy).toHaveBeenCalledWith(payload);

      tick(0);
      expect(store.isPending()).toBe(false);
      expect(store.error()).toBe('Error');
    }));
  });
});
