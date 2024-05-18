import {
  ISignInReq,
  ISignInRes,
  ISignUpReq,
} from '@libs/authentication-shared';
import { TokenService, UserEntity, UserRepository } from '@libs/core-api';
import { JwtToken } from '@libs/shared';
import { Injectable } from '@nestjs/common';

interface ISignInPayload {
  tokens: { access: JwtToken; refresh: JwtToken };
  res: ISignInRes;
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
}
