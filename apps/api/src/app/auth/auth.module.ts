import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthenticationController } from './authentication.controller';

@Module({
  controllers: [AuthController, AuthenticationController],
})
export class AppAuthModule {}
