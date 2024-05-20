import { TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UserId } from '@libs/shared';
import { AuthStore } from '../../data-access/auth.store';
import { AUTH_REDIRECT_PATH_TOKEN } from '../auth.token';
import { authGuardFunction, authenticationGuardFunction } from './auth.guard';

jest.mock('../../data-access/auth.store');

describe('AuthGuard', () => {
  const setup = () => {
    TestBed.configureTestingModule({
      providers: [{ provide: AUTH_REDIRECT_PATH_TOKEN, useValue: [''] }],
    });
    const router = TestBed.inject(Router);
    const authStore = TestBed.inject(AuthStore);
    return { authStore, router };
  };

  describe('authGuardFunction', () => {
    it('should returns false and redirect for not logged user', waitForAsync(() => {
      const { router } = setup();
      const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation();

      TestBed.runInInjectionContext(() => {
        const guard = authGuardFunction({} as any, {} as any);
        expect(guard).toBe(false);
        expect(navigateSpy).toHaveBeenCalled();
      });
    }));

    it('should returns true for logged user', waitForAsync(() => {
      const { authStore } = setup();
      jest.spyOn(authStore, 'userId').mockImplementation(() => 1 as UserId);

      TestBed.runInInjectionContext(() => {
        const guard = authGuardFunction({} as any, {} as any);
        expect(guard).toBe(true);
      });
    }));
  });

  describe('authenticationGuardFunction', () => {
    it('should returns false and redirect for logged user', waitForAsync(() => {
      const { router, authStore } = setup();
      jest.spyOn(authStore, 'userId').mockImplementation(() => 1 as UserId);
      const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation();

      TestBed.runInInjectionContext(() => {
        const guard = authenticationGuardFunction({} as any, {} as any);
        expect(guard).toBe(false);
        expect(navigateSpy).toHaveBeenCalled();
      });
    }));

    it('should returns true for nt logged user', waitForAsync(() => {
      setup();

      TestBed.runInInjectionContext(() => {
        const guard = authenticationGuardFunction({} as any, {} as any);
        expect(guard).toBe(true);
      });
    }));
  });
});
