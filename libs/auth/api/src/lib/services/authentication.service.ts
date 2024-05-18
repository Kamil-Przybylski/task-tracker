import { ISignInReq, ISignInRes, ISignUpReq, IUser } from '@libs/auth-shared';
import { UserEntity, UserRepository } from '@libs/core-api';
import { JwtToken, UserId } from '@libs/shared';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from './token.service';

interface ISignInPayload {
  tokens: { access: JwtToken; refresh: JwtToken };
  res: ISignInRes;
}
interface IRefreshTokenPayload {
  accessToken: JwtToken;
  accessTokenExp: number;
}

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
  ) {}

  public signUp(signUpDto: ISignUpReq): Promise<UserEntity> {
    return this.userRepository.createOne(signUpDto);
  }

  public async signIn(signInDto: ISignInReq): Promise<ISignInPayload> {
    const user = await this.userRepository.findOneByCredentials(signInDto);

    const accessTokenObj = await this.tokenService.getTokenPayload(
      user.id,
      'access',
    );
    const refreshTokenObj = await this.tokenService.getTokenPayload(
      user.id,
      'refresh',
    );

    const hashedRefreshToken = await this.tokenService.hashToken(
      refreshTokenObj.token,
    );
    await this.userRepository.updateOne(user.id, { hashedRefreshToken });

    return {
      tokens: { access: accessTokenObj.token, refresh: refreshTokenObj.token },
      res: {
        userId: user.id,
        accessTokenExp: accessTokenObj.exp,
        refreshTokenExp: refreshTokenObj.exp,
      },
    };
  }

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
