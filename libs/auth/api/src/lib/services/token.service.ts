import { IConfig } from '@libs/core-api';
import { JwtToken, UserId } from '@libs/shared';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

type TokenType = 'access' | 'refresh';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cs: ConfigService<IConfig>,
  ) {}

  async getTokenPayload(id: UserId, type: TokenType): Promise<JwtToken> {
    const tokenPayload = { sub: id };
    return (await this.jwtService.signAsync(tokenPayload, {
      expiresIn:
        type === 'refresh'
          ? this.cs.get('AUTH_REFRESH_EXPIRES_IN')
          : this.cs.get('AUTH_ACCESS_EXPIRES_IN'),
    })) as JwtToken;
  }

  async hashToken(token: JwtToken): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(token, salt);
  }

  async validToken(
    token: JwtToken,
    hashedRefreshToken: string | null,
  ): Promise<void> {
    if (!hashedRefreshToken) throw new UnauthorizedException();
    const isValid = await bcrypt.compare(token, hashedRefreshToken);
    if (!isValid) throw new UnauthorizedException();
  }
}
