import {
  AuthenticationService,
  RefreshTokenReqDto,
  RefreshTokenResDto,
  SignInReqDto,
  SignInResDto,
  SingUpDto,
  UserResDto,
} from '@libs/auth-api';
import { AuthRoutesEnum, AuthRoutesParamsEnum } from '@libs/auth-shared';
import { UserEntity } from '@libs/core-api';
import { UserId } from '@libs/shared';
import { GetUser, JwtRefreshGuard } from '@libs/shared-api';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { addDays } from 'date-fns';
import { FastifyReply } from 'fastify';

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
    const payload = await this.authService.signIn(signInDto);
    response.setCookie('accessToken', payload.accessToken, {
      httpOnly: true,
      path: '/',
      expires: addDays(new Date(), 10),
    });
    response.send(new SignInResDto(payload));
  }

  @Post(AuthRoutesEnum.REFRESH_TOKEN)
  @UseGuards(JwtRefreshGuard)
  public async getRefreshToken(
    @GetUser() user: UserEntity,
    @Body() refreshTokenDto: RefreshTokenReqDto,
  ): Promise<RefreshTokenResDto> {
    if (!refreshTokenDto) throw new UnauthorizedException();
    const payload = await this.authService.getRefreshToken(
      user,
      refreshTokenDto.refreshToken,
    );
    return new RefreshTokenResDto(payload);
  }

  @Get(`${AuthRoutesEnum.LOGOUT}/:${AuthRoutesParamsEnum.USER_ID}`)
  logout(
    @Param(AuthRoutesParamsEnum.USER_ID) userId: UserId,
  ): Promise<unknown> {
    return this.authService.logout(userId);
  }
}
