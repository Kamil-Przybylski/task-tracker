import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IRefreshTokenRes } from '@libs/core-shared';
import { UserId } from '@libs/shared';
import { LocalStorage } from '@libs/shared-web';
import { of } from 'rxjs';
import { APP_CONFIG } from '../../config';
import { AUTH_REDIRECT_PATH_TOKEN } from '../feature-auth/auth.token';
import { ILoginPayload } from '../models/login.model';
import { AuthApiService } from './auth-api.service';
import { AuthStore } from './auth.store';

jest.mock('@libs/shared-web');
Object.defineProperty(window, 'location', { writable: true });

describe('AuthStore', () => {
  const mockedItem = 2716227625711;
  let httpController: HttpTestingController;

  const setup = (
    beforeInit?: (
      lsSpy: jest.SpyInstance,
      refreshSpy: jest.SpyInstance,
    ) => void,
  ) => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: APP_CONFIG, useValue: { apiUrl: 'https://test.com' } },
        { provide: AUTH_REDIRECT_PATH_TOKEN, useValue: [''] },
        AuthStore,
      ],
    });
    const apiService = TestBed.inject(AuthApiService);
    httpController = TestBed.inject(HttpTestingController);

    beforeInit?.(
      jest.spyOn(LocalStorage, 'getItem'),
      jest.spyOn(apiService, 'getRefreshToken'),
    );
    const store = TestBed.inject(AuthStore);

    return { store };
  };

  afterEach(() => {
    httpController.verify();
  });

  it('should init correctly store when local storage is empty', () => {
    const { store } = setup((lsSpy) => {
      lsSpy.mockImplementation(() => null);
    });
    expect(store).toBeTruthy();
    expect(store.userId()).toBe(null);
    expect(store.refreshTokenExpiresAt()).toBe(null);
  });

  it('should init correctly store when local storage has a user', () => {
    const { store } = setup((lsSpy, refreshSpy) => {
      lsSpy.mockImplementation(() => mockedItem.toString());
      refreshSpy.mockImplementation(() => of());
    });

    expect(store).toBeTruthy();
    expect(store.userId()).toBe(mockedItem);
    expect(store.refreshTokenExpiresAt()).toBe(mockedItem);
  });

  describe('login', () => {
    it('should correctly login', () => {
      const { store } = setup((lsSpy) => {
        lsSpy.mockImplementation(() => null);
      });
      const payload: ILoginPayload = {
        accessTokenExp: 1,
        refreshTokenExp: 2,
        userId: 3 as UserId,
      };

      store.login(payload);
      expect(store.userId()).toBe(payload.userId);
      expect(store.refreshTokenExpiresAt()).toBe(payload.refreshTokenExp);
      expect(store.accessTokenExpiresAt()).toBe(payload.accessTokenExp);
    });
  });

  describe('logout', () => {
    it('should correctly logout with success response', () => {
      const { store } = setup((lsSpy, refreshSpy) => {
        lsSpy.mockImplementation(() => mockedItem.toString());
        refreshSpy.mockImplementation(() => of());
      });
      expect(store.userId()).toBe(mockedItem);

      store.logout();

      const req = httpController.expectOne(
        `https://test.com/auth/logout/${mockedItem}`,
      );
      req.flush(null);

      expect(store.userId()).toBe(null);
      expect(store.refreshTokenExpiresAt()).toBe(null);
    });

    it('should correctly logout when no userId', () => {
      const { store } = setup((lsSpy) => {
        lsSpy.mockImplementation(() => null);
      });
      expect(store.userId()).toBe(null);

      store.logout();
      expect(store.userId()).toBe(null);
      expect(store.refreshTokenExpiresAt()).toBe(null);
    });

    it('should correctly logout with error response', () => {
      const { store } = setup((lsSpy, refreshSpy) => {
        lsSpy.mockImplementation(() => mockedItem.toString());
        refreshSpy.mockImplementation(() => of());
      });
      expect(store.userId()).toBe(mockedItem);

      store.logout();

      const req = httpController.expectOne(
        `https://test.com/auth/logout/${mockedItem}`,
      );
      req.flush('Server Error', { status: 404, statusText: 'Not found' });

      expect(store.userId()).toBe(null);
      expect(store.refreshTokenExpiresAt()).toBe(null);
    });
  });

  describe('refreshToken', () => {
    it('should get refresh token with success', () => {
      const { store } = setup((lsSpy) => {
        lsSpy.mockImplementation(() => mockedItem.toString());
      });
      expect(store.accessTokenExpiresAt()).toBe(null);

      store.refreshToken();
      const req = httpController.expectOne(
        'https://test.com/auth/refresh-token',
      );
      const payload: IRefreshTokenRes = {
        accessTokenExp: 1,
      };
      req.flush(payload);

      expect(store.accessTokenExpiresAt()).toBe(payload.accessTokenExp);
    });

    it('should logout when refresh token returns an error', () => {
      const { store } = setup((lsSpy) => {
        lsSpy.mockImplementation(() => mockedItem.toString());
      });
      expect(store.userId()).toBe(mockedItem);

      store.refreshToken();
      const req1 = httpController.expectOne(
        'https://test.com/auth/refresh-token',
      );
      req1.flush('Server Error', { status: 401, statusText: 'Not found!' });
      const req2 = httpController.expectOne(
        `https://test.com/auth/logout/${mockedItem}`,
      );
      req2.flush(null);

      expect(store.userId()).toBe(null);
      expect(store.refreshTokenExpiresAt()).toBe(null);
    });
  });
});
