import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthStrategyEnum } from '../enums/auth-strategy.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard(AuthStrategyEnum.JWT) {}
