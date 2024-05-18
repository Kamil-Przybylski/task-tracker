import { DatabaseModule } from '@libs/core-api';
import { Global, Module } from '@nestjs/common';
import { AuthenticationService } from './services/authentication.service';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [AuthenticationService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
