import { IConfig } from '@libs/core-api';
import { JwtToken, UserId } from '@libs/shared';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

interface IGetTokenPayload {
  token: JwtToken;
  exp: number;
}

type TokenType = 'access' | 'refresh';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cs: ConfigService<IConfig>,
  ) {}

  async getTokenPayload(
    id: UserId,
    type: TokenType,
  ): Promise<IGetTokenPayload> {
    const tokenPayload = { sub: id };
    const token = (await this.jwtService.signAsync(tokenPayload, {
      expiresIn:
        type === 'refresh'
          ? this.cs.get('AUTH_REFRESH_EXPIRES_IN')
          : this.cs.get('AUTH_ACCESS_EXPIRES_IN'),
    })) as JwtToken;

    return {
      token,
      exp: this.getExpTime(token),
    };
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

  private getExpTime(token: JwtToken): number {
    return this.jwtService.decode(token, { json: true }).exp * 1000;
  }
}
