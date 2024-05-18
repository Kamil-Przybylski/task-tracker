import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { IConfig } from '../config/config.model';
import { DatabaseModule } from '../database/database.module';
import { AuthService } from './services/auth.service';
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
  providers: [JwtStrategy, JwtRefreshStrategy, AuthService, TokenService],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
