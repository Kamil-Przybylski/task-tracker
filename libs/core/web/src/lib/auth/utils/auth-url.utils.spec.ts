import { isAuthPath } from './auth-url.utils';

describe('isAuthPath', () => {
  it('should return false if empty url', () => {
    expect(isAuthPath('')).toBe(false);
  });

  it("should return false if url doesn't contain auth", () => {
    expect(isAuthPath('api/home')).toBe(false);
  });

  it('should return true if it is a auth URL', () => {
    expect(isAuthPath('auth/sign-in')).toBe(true);
  });
});
