import { JwtToken } from '@libs/shared';
import { jwtDecode } from 'jwt-decode';

export abstract class TokenUtils {
  static decodeToken<T extends { exp?: number }>(
    token: JwtToken,
  ): T & { expTime: number } {
    const decoded = jwtDecode<T>(token);
    if (!decoded?.exp) throw new Error('Wrong JWT token format!');
    return { ...decoded, expTime: decoded.exp * 1000 };
  }
}
