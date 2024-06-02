import { AuthenticationService } from '@libs/authentication-api';
import {
  AuthenticationRoutesEnum,
  ISignInReqDto,
  ISignInResDto,
  ISignUpReqDto,
  ISignUpResDto,
  signInReqSchema,
  signUpReqSchema,
} from '@libs/authentication-shared';
import { ZodValidationPipe } from '@libs/core-api/auth';
import { AuthRoutesEnum } from '@libs/core-shared';
import { CookiesEnum } from '@libs/shared-api';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Res,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Controller(AuthRoutesEnum.AUTH)
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post(AuthenticationRoutesEnum.SING_UP)
  @UsePipes(new ZodValidationPipe(signUpReqSchema))
  public async singUp(
    @Body() signUpDto: ISignUpReqDto,
  ): Promise<ISignUpResDto> {
    await this.authService.signUp(signUpDto);
    return { status: 'created' };
  }

  @Post(AuthenticationRoutesEnum.SING_IN)
  @UsePipes(new ZodValidationPipe(signInReqSchema))
  public async singIn(
    @Body() signInDto: ISignInReqDto,
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
    response.send(res satisfies ISignInResDto);
  }
}
