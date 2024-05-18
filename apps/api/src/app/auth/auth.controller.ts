import { AuthService, RefreshTokenResDto, UserEntity } from '@libs/core-api';
import { AuthRoutesEnum, AuthRoutesParamsEnum } from '@libs/core-shared';
import { JwtToken, UserId } from '@libs/shared';
import { CookiesEnum, GetUser, JwtRefreshGuard } from '@libs/shared-api';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller(AuthRoutesEnum.AUTH)
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
