import { DatabaseModule, IConfig } from '@libs/core-api';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationService } from './services/authentication.service';
import { TokenService } from './services/token.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (cs: ConfigService<IConfig>) => {
        return {
          secret: cs.get('AUTH_SECRET'),
          signOptions: { expiresIn: cs.get('AUTH_ACCESS_EXPIRES_IN') },
        };
      },
      inject: [ConfigService],
    }),
    DatabaseModule,
  ],
  providers: [
    JwtStrategy,
    JwtRefreshStrategy,
    AuthenticationService,
    TokenService,
  ],
  exports: [AuthenticationService],
})
export class AuthModule {}
