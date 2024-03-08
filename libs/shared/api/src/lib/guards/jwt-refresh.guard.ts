import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthStrategyEnum } from '../enums';

@Injectable()
export class JwtRefreshGuard extends AuthGuard(AuthStrategyEnum.JWT_REFRESH) {}
