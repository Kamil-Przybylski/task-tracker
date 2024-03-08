import { UserResDto } from '@libs/auth-api';
import { UserEntity } from '@libs/core-api';
import { GetUser, JwtAuthGuard } from '@libs/shared-api';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

@Controller()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class AppController {
  @Get()
  getData(@GetUser() user: UserEntity) {
    return { api: true, user: new UserResDto(user) };
  }
}
