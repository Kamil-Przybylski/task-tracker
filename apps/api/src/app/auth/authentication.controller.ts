import {
  AuthenticationService,
  SignInReqDto,
  SignInResDto,
  SingUpDto,
} from '@libs/authentication-api';
import { AuthenticationRoutesEnum } from '@libs/authentication-shared';
import { UserResDto } from '@libs/core-api';
import { AuthRoutesEnum } from '@libs/core-shared';
import { CookiesEnum } from '@libs/shared-api';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Controller(AuthRoutesEnum.AUTH)
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post(AuthenticationRoutesEnum.SING_UP)
  public async singUp(@Body() signUpDto: SingUpDto): Promise<UserResDto> {
    const user = await this.authService.signUp(signUpDto);
    return new UserResDto(user);
  }

  @Post(AuthenticationRoutesEnum.SING_IN)
  public async singIn(
    @Body() signInDto: SignInReqDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<void> {
    const { tokens, res } = await this.authService.signIn(signInDto);
    response.setCookie(CookiesEnum.ACCESS_TOKEN, tokens.access, {
      httpOnly: true,
      path: '/',
      expires: new Date(res.accessTokenExp),
    });
    response.setCookie(CookiesEnum.REFRESH_TOKEN, tokens.refresh, {
      httpOnly: true,
      path: '/',
      expires: new Date(res.refreshTokenExp),
    });
    response.send(new SignInResDto(res));
  }
}
