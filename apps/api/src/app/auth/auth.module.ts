import { AuthenticationModule } from '@libs/authentication-api';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthenticationController } from './authentication.controller';

@Module({
  imports: [AuthenticationModule],
  controllers: [AuthController, AuthenticationController],
})
export class AppAuthModule {}
