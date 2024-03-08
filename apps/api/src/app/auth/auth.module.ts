import { Module } from '@nestjs/common';
import { AuthenticationController } from './auth.controller';

@Module({
  controllers: [AuthenticationController],
})
export class AppAuthModule {}
