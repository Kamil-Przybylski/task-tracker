import { ClassSerializerInterceptor, Module } from '@nestjs/common';

import { AuthModule } from '@libs/core-api/auth';
import { ConfigRootModule } from '@libs/core-api/config';
import { DatabaseModule } from '@libs/core-api/database';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppAuthModule } from './auth/auth.module';
import { AppWorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [
    ConfigRootModule,
    DatabaseModule,
    AuthModule,

    AppAuthModule,
    AppWorkspaceModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
