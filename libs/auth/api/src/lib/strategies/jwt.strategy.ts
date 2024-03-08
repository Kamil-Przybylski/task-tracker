import { IUser } from '@libs/auth-shared';
import { IConfig, UserRepository } from '@libs/core-api';
import { UserId } from '@libs/shared';
import { AuthStrategyEnum } from '@libs/shared-api';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  AuthStrategyEnum.JWT,
) {
  constructor(
    private readonly userRepository: UserRepository,
    cs: ConfigService<IConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: cs.get('AUTH_SECRET'),
    });
  }

  async validate(payload: { sub: UserId }): Promise<IUser> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      isLoggedIn: true,
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
