import {
  IRefreshTokenRes,
  ISignInReq,
  ISignInRes,
  ISignUpReq,
  IUser,
} from '@libs/auth-shared';
import { UserEntity, UserRepository } from '@libs/core-api';
import { JwtToken, UserId } from '@libs/shared';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from './token.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
  ) {}

  public signUp(signUpDto: ISignUpReq): Promise<UserEntity> {
    return this.userRepository.createOne(signUpDto);
  }

  public async signIn(signInDto: ISignInReq): Promise<ISignInRes> {
    const user = await this.userRepository.findOneByCredentials(signInDto);

    const accessToken = await this.tokenService.getTokenPayload(
      user.id,
      'access',
    );
    const refreshToken = await this.tokenService.getTokenPayload(
      user.id,
      'refresh',
    );

    const hashedRefreshToken = await this.tokenService.hashToken(refreshToken);
    await this.userRepository.updateOne(user.id, { hashedRefreshToken });

    return { accessToken, refreshToken, user };
  }

  public async logout(userId: UserId): Promise<unknown> {
    await this.userRepository.updateOne(userId, { hashedRefreshToken: null });
    return null;
  }

  public async getRefreshToken(
    currentUser: IUser,
    refreshToken: JwtToken,
  ): Promise<IRefreshTokenRes> {
    const user = await this.userRepository.findOne({
      where: { id: currentUser.id },
      isLoggedIn: true,
    });
    if (!user) throw new UnauthorizedException();
    await this.tokenService.validToken(refreshToken, user?.hashedRefreshToken);

    const token = await this.tokenService.getTokenPayload(user.id, 'access');
    return {
      accessToken: token,
    };
  }
}
