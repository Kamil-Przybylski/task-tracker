import { DatabaseModule } from '@libs/core-api';
import { Module } from '@nestjs/common';
import { AuthenticationService } from './services/authentication.service';

@Module({
  imports: [DatabaseModule],
  providers: [AuthenticationService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
