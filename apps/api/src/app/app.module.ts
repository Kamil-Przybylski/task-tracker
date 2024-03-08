import { AuthModule } from '@libs/auth-api';
import { Module } from '@nestjs/common';

import { ConfigRootModule, DatabaseModule } from '@libs/core-api';
import { AppController } from './app.controller';
import { AppAuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigRootModule, DatabaseModule, AuthModule, AppAuthModule],
  controllers: [AppController],
})
export class AppModule {}
