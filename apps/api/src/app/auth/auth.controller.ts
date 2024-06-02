import { AuthService, GetUser, RefreshTokenResDto } from '@libs/core-api/auth';
import { UserEntity } from '@libs/core-api/database';
import { AuthRoutesEnum, AuthRoutesParamsEnum } from '@libs/core-shared';
import { JwtToken, UserId } from '@libs/shared';
import { CookiesEnum, JwtRefreshGuard } from '@libs/shared-api';
import {
  Controller,
  Get,
  Param,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller(AuthRoutesEnum.AUTH)
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
