import { Module } from '@nestjs/common';
import { AuthService } from './use-case/auth.service';
import { AuthController } from '../auth/presentation/auth.controller';
import { SecretService } from 'src/common/service/secret.service';
import { GoogleOAuthStrategy } from 'src/common/strategy/google.strategy';
import { JwtStrategy } from 'src/common/strategy/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, SecretService, GoogleOAuthStrategy, JwtStrategy],
})
export class AuthModule {}
