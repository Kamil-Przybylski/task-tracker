import { Module } from '@nestjs/common';

import { AuthenticationModule } from '@libs/authentication-api';
import { AuthModule, ConfigRootModule, DatabaseModule } from '@libs/core-api';
import { AppController } from './app.controller';
import { AppAuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigRootModule,
    DatabaseModule,
    AppAuthModule,
    AuthModule,
    AuthenticationModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
