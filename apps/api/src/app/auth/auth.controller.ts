import {
  AuthenticationService,
  RefreshTokenResDto,
  SignInReqDto,
  SignInResDto,
  SingUpDto,
  UserResDto,
} from '@libs/auth-api';
import { AuthRoutesEnum, AuthRoutesParamsEnum } from '@libs/auth-shared';
import { UserEntity } from '@libs/core-api';
import { JwtToken, UserId } from '@libs/shared';
import { CookiesEnum, GetUser, JwtRefreshGuard } from '@libs/shared-api';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller(AuthRoutesEnum.AUTH)
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post(AuthRoutesEnum.SING_UP)
  public async singUp(@Body() signUpDto: SingUpDto): Promise<UserResDto> {
    const user = await this.authService.signUp(signUpDto);
    return new UserResDto(user);
  }

  @Post(AuthRoutesEnum.SING_IN)
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

  @Get(AuthRoutesEnum.REFRESH_TOKEN)
  @UseGuards(JwtRefreshGuard)
  public async getRefreshToken(
    @GetUser() user: UserEntity,
    @Req() request: FastifyRequest,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<void> {
    const refreshToken = request.cookies[CookiesEnum.REFRESH_TOKEN] as JwtToken;
    if (!refreshToken) throw new UnauthorizedException();
    const payload = await this.authService.getRefreshToken(user, refreshToken);

    response.setCookie(CookiesEnum.ACCESS_TOKEN, payload.accessToken, {
      httpOnly: true,
      path: '/',
      expires: new Date(payload.accessTokenExp),
    });
    response.send(new RefreshTokenResDto(payload.accessTokenExp));
  }

  @Get(`${AuthRoutesEnum.LOGOUT}/:${AuthRoutesParamsEnum.USER_ID}`)
  logout(
    @Param(AuthRoutesParamsEnum.USER_ID) userId: UserId,
  ): Promise<unknown> {
    return this.authService.logout(userId);
  }
}
