import { IUser } from '@libs/core-shared';
import { JwtToken, UserId } from '@libs/shared';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../database/repositories';
import { TokenService } from './token.service';

interface IRefreshTokenPayload {
  accessToken: JwtToken;
  accessTokenExp: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
  ) {}

  public async logout(userId: UserId): Promise<unknown> {
    await this.userRepository.updateOne(userId, { hashedRefreshToken: null });
    return null;
  }

  public async getRefreshToken(
    currentUser: IUser,
    refreshToken: JwtToken,
  ): Promise<IRefreshTokenPayload> {
    const user = await this.userRepository.findOne({
      where: { id: currentUser.id },
      isLoggedIn: true,
    });
    if (!user) throw new UnauthorizedException();
    await this.tokenService.validToken(refreshToken, user?.hashedRefreshToken);

    const tokenObj = await this.tokenService.getTokenPayload(user.id, 'access');
    return {
      accessToken: tokenObj.token,
      accessTokenExp: tokenObj.exp,
    };
  }
}
